const fs = require('fs');
let file = fs.readFileSync('src/components/layout/AdminLayout.tsx', 'utf8');

const targetStr = `import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';`;
const replaceStr = `import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';`;

file = file.replace(targetStr, replaceStr);

const targetStr2 = `import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Ticket,
  LogOut,
  Store,
  CreditCard,
  Palette,
  Megaphone,
  Globe, ShieldAlert
} from 'lucide-react';`;
const replaceStr2 = `import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Ticket,
  LogOut,
  Store,
  CreditCard,
  Palette,
  Megaphone,
  Globe, ShieldAlert,
  ChevronDown, ChevronRight, Layers, BarChart3, FileText, Sliders
} from 'lucide-react';`;

file = file.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/components/layout/AdminLayout.tsx', file);
