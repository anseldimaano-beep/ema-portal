import React,{useState} from 'react';
import {Search} from 'lucide-react';
const SearchBar=()=>{const[q,setQ]=useState('');return<div className="relative"><Search className="absolute left-3 top-3 h-5 w-5 text-gray-400"/><input type="text"value={q}onChange={e=>setQ(e.target.value)}placeholder="Search..."className="input-field pl-10 w-full md:w-96"/></div>;};
export default SearchBar;