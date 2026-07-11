import React from 'react';
const CourseCard = ({course}) => <div className="card"><h3 className="font-bold">{course.code}</h3><p>{course.title}</p></div>;
export default CourseCard;