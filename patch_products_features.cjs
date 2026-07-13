const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

const target1 = `    features: [''],`;
file = file.replace(target1, '');

const target2 = `        features: product.features?.length ? product.features : [''],`;
file = file.replace(target2, '');

const target3 = `  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const removeFeature = (index: number) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });`;
file = file.replace(target3, '');

const target4 = `        features: formData.features.filter(f => f.trim() !== '')`;
file = file.replace(target4, '');

fs.writeFileSync('src/pages/admin/Products.tsx', file);
