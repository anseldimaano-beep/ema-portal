import React from 'react';
const FacultyCard = ({faculty}) => <div className="card"><h3 className="font-bold">{faculty.full_name}</h3><p>{faculty.department}</p></div>;
export default FacultyCard;