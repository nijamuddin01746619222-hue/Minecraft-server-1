const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const targetStr = `  const handleOpenModal = (product?: any) => {
    if (product) {`;
const replaceStr = `  const handleOpenModal = (product?: any) => {
    if (product) {`;

const target2 = `    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setIsModalOpen(true);
  };`;
const replace2 = `    } else {
      setEditingId(null);
      setFormData({...defaultForm, category: categoryFilter});
    }
    setIsModalOpen(true);
  };`;
file = file.replace(target2, replace2);

fs.writeFileSync('src/pages/admin/Products.tsx', file);
