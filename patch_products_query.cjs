const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';`;
const replaceStr = `import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../lib/firebase';`;

file = file.replace(targetStr, replaceStr);

const targetStr2 = `  const [formData, setFormData] = useState(defaultForm);
  

  const fetchProducts = async () => {`;
const replaceStr2 = `  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'ranks';

  const [formData, setFormData] = useState(defaultForm);
  

  const fetchProducts = async () => {`;

file = file.replace(targetStr2, replaceStr2);

const targetStr3 = `  useEffect(() => {
    fetchProducts();
  }, []);`;
const replaceStr3 = `  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);`;

file = file.replace(targetStr3, replaceStr3);

const targetStr4 = `    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));`;
const replaceStr4 = `    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => p.category === categoryFilter));`;
file = file.replace(targetStr4, replaceStr4);

const targetStr5 = `  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };`;
const replaceStr5 = `  const openAddModal = () => {
    setEditingId(null);
    setFormData({...defaultForm, category: categoryFilter});
    setIsModalOpen(true);
  };`;
file = file.replace(targetStr5, replaceStr5);


fs.writeFileSync('src/pages/admin/Products.tsx', file);
