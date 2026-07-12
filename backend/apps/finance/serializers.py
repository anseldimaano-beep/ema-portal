from rest_framework import serializers
from .models import StudentAccount, ExamPermit


class ExamPermitSerializer(serializers.ModelSerializer):
    exam_type_display = serializers.CharField(source='get_exam_type_display', read_only=True)
    is_released = serializers.BooleanField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = ExamPermit
        fields = [
            'id', 'exam_type', 'exam_type_display', 'required_percent',
            'manual_override', 'is_released', 'status', 'remarks',
            'released_at', 'updated_at',
        ]
        read_only_fields = ['id', 'released_at', 'updated_at']


class StudentAccountSerializer(serializers.ModelSerializer):
    """Full account serializer: fee breakdown + nested exam permits."""

    term_display = serializers.CharField(source='get_term_display', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_number = serializers.CharField(source='student.username', read_only=True)
    enrollment_status = serializers.CharField(source='student.enrollment_status', read_only=True)

    total_fee = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_paid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tuition_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    misc_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    percent_paid = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    exam_permits = ExamPermitSerializer(many=True, read_only=True)

    class Meta:
        model = StudentAccount
        fields = [
            'id', 'student', 'student_name', 'student_number', 'enrollment_status',
            'term', 'term_display',
            'tuition_fee', 'tuition_paid', 'tuition_balance',
            'misc_fee', 'misc_paid', 'misc_balance',
            'total_fee', 'total_paid', 'total_balance', 'percent_paid',
            'notes', 'exam_permits', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentAccountManageSerializer(serializers.ModelSerializer):
    """Writable serializer for cashier/admin fee management."""

    class Meta:
        model = StudentAccount
        fields = [
            'id', 'student', 'term', 'tuition_fee', 'tuition_paid',
            'misc_fee', 'misc_paid', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
