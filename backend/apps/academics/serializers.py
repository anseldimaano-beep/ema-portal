from rest_framework import serializers
from .models import Course, CourseOffering, Enrollment, Grade, Room, RoomReservation
from apps.accounts.serializers import UserSerializer


class CourseSerializer(serializers.ModelSerializer):
    department_display = serializers.CharField(source='get_department_display', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    prerequisites_list = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'code', 'title', 'description', 'level', 'level_display',
            'units', 'lecture_hours', 'lab_hours', 'department', 'department_display',
            'semester_offered', 'year_level', 'prerequisites_list',
            'is_active', 'created_at'
        ]

    def get_prerequisites_list(self, obj):
        return [{'id': p.id, 'code': p.code, 'title': p.title} for p in obj.prerequisites.all()]


class CourseOfferingSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source='course', write_only=True
    )
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=Course._meta.get_field('prerequisites').related_model.objects.all(),
        source='instructor', write_only=True, required=False, allow_null=True
    )
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    available_slots = serializers.ReadOnlyField()

    class Meta:
        model = CourseOffering
        fields = [
            'id', 'course', 'course_id', 'semester', 'section',
            'instructor_name', 'instructor_id', 'schedule', 'room',
            'capacity', 'enrolled_count', 'available_slots',
            'status', 'status_display', 'created_at'
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    course_offering = CourseOfferingSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course_offering', 'status', 'status_display', 'enrolled_at']


class GradeSerializer(serializers.ModelSerializer):
    enrollment = EnrollmentSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id', 'enrollment', 'prelim_grade', 'midterm_grade',
            'prefinal_grade', 'final_grade', 'computed_grade',
            'grade_equivalent', 'status', 'status_display',
            'remarks', 'is_incomplete', 'is_dropped',
            'entered_by', 'verified_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['computed_grade', 'grade_equivalent', 'entered_by', 'verified_by']


class GradeEntrySerializer(serializers.ModelSerializer):
    """Serializer for faculty entering grades."""
    student_name = serializers.CharField(source='enrollment.student.get_full_name', read_only=True)
    course_code = serializers.CharField(source='enrollment.course_offering.course.code', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id', 'enrollment', 'student_name', 'course_code',
            'prelim_grade', 'midterm_grade', 'prefinal_grade', 'final_grade',
            'computed_grade', 'grade_equivalent', 'status', 'remarks'
        ]
        read_only_fields = ['computed_grade', 'grade_equivalent']

    def update(self, instance, validated_data):
        # Auto-compute grade when all components are present
        instance = super().update(instance, validated_data)
        instance.compute_final_grade()
        instance.save()
        return instance


class StudentGradeViewSerializer(serializers.ModelSerializer):
    """Serializer for students viewing their own grades."""
    course_code = serializers.CharField(source='enrollment.course_offering.course.code', read_only=True)
    course_title = serializers.CharField(source='enrollment.course_offering.course.title', read_only=True)
    section = serializers.CharField(source='enrollment.course_offering.section', read_only=True)
    semester = serializers.CharField(source='enrollment.course_offering.semester', read_only=True)
    units = serializers.IntegerField(source='enrollment.course_offering.course.units', read_only=True)
    instructor = serializers.CharField(source='enrollment.course_offering.instructor.get_full_name', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id', 'course_code', 'course_title', 'section', 'semester',
            'units', 'instructor', 'prelim_grade', 'midterm_grade',
            'prefinal_grade', 'final_grade', 'computed_grade',
            'grade_equivalent', 'status', 'remarks'
        ]


class RoomSerializer(serializers.ModelSerializer):
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'name', 'code', 'room_type', 'room_type_display',
            'building', 'floor', 'capacity', 'has_projector',
            'has_computers', 'has_aircon', 'has_whiteboard',
            'is_active', 'notes'
        ]


class RoomReservationSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(), source='room', write_only=True
    )
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    purpose_display = serializers.CharField(source='get_purpose_display', read_only=True)

    class Meta:
        model = RoomReservation
        fields = [
            'id', 'room', 'room_id', 'requested_by_name',
            'purpose', 'purpose_display', 'purpose_description',
            'date', 'start_time', 'end_time', 'expected_attendees',
            'status', 'status_display', 'approved_by_name',
            'approved_at', 'rejection_reason', 'created_at'
        ]
        read_only_fields = ['status', 'approved_by', 'approved_at', 'rejection_reason']


class RoomReservationAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin managing reservations."""
    class Meta:
        model = RoomReservation
        fields = '__all__'
