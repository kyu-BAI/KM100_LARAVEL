import AddDocumentModal from './components/documents/AddDocumentModal';
import DocumentTableView from './components/documents/DocumentTableView';
import ConsumablesTableView from './components/documents/ConsumablesTableView';
import SalesIncomeCalendarView from './components/documents/SalesIncomeCalendarView';
import DocumentCardsView from './components/documents/DocumentCardsView';
import DocumentViewerModal from './components/documents/DocumentViewerModal';
import RenameDocumentModal from './components/documents/RenameDocumentModal';
import TopHeader from './components/navigation/TopHeader';
import SidebarDirectory from './components/navigation/SidebarDirectory';
import AdminPortalPage from './components/admin/AdminPortalPage';
import AuthPortalView from './components/auth/AuthPortalView';
import EmployeeSessionModal from './components/employee/EmployeeSessionModal';
import { exportRecordsToExcel } from './services/excelService';
import { RECEIPT_TYPES } from './constants/receiptTypes';
import { EMPLOYEE_ROLES, EMPLOYEE_DEPARTMENTS } from './constants/employeeConfig';
import { SHORT_MONTHS as months } from './constants/calendar';
import { createStyles } from './styles/themeStyles';
import React, { useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import {
  UserCheck,
  Briefcase,
  Folder,
  FileText,
  FileSpreadsheet,
  Calendar,
  Layers,
  PlusCircle,
  Search,
  Download,
  Trash2,
  X,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Package,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Printer,
  UploadCloud,
  Camera,
  ArrowLeft,
  Check,
  RefreshCw,
  FileUp,
  Image as ImageIcon,
  Lock,
  Mail,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Key,
  Shield,
  Smartphone,
  Building2,
  DollarSign,
  Receipt,
  Sun,
  Moon,
  Edit3,
  TrendingUp,
  CreditCard,
  FolderOpen,
  Plus
} from 'lucide-react';
import { mapFromDb, mapToDb } from './services/dataMapper';
import { backend, isLaravelDriver } from './services/backendAdapter';
import { getAuthToken, getStoredUser, setStoredUser, setAuthToken } from './services/api';
import { runOcrOnImage } from './services/ocrService';
import { loadCachedItems, saveCachedItems, getCacheSyncTime, clearCachedItems, loadUserCachedItems, saveUserCachedItems } from './services/cacheService';

export default function App() {
  const { width, height } = useWindowDimensions();

  const isSmallMobile = width < 480;            // Compact smartphones (320px - 480px, e.g. iPhone SE, small Androids)
  const isMobile = width < 768;                 // All smartphones (< 768px)
  const isTablet = width >= 768 && width < 1024;// Tablets (768px - 1023px, iPad portrait, foldables)
  const isDesktop = width >= 1024;              // Desktops & Laptops (>= 1024px)
  const isDrawerMode = width < 1024;            // Sidebar operates as slide-in drawer on mobile & tablet
  const useCardsView = width < 860;             // Document cards view (< 860px), Data table (>= 860px)
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : false));

  const [items, setItems] = useState(() => loadUserCachedItems(getStoredUser()));
  const [loading, setLoading] = useState(() => loadUserCachedItems(getStoredUser()).length === 0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cacheSyncLabel, setCacheSyncLabel] = useState(() => getCacheSyncTime(getStoredUser()));

  // Unified single-source navigation state controlled 100% by left sidebar
  const [activeNav, _setActiveNav] = useState({
    type: 'all',
    year: null,
    month: null,
    subCategory: null,
    label: 'All Inventory Files'
  });

  const setActiveNav = (nav) => {
    _setActiveNav(nav);
    if (isDrawerMode) {
      setSidebarOpen(false);
    }
  };

  // Toggle state to control whether all files within the system are displayed
  const [showAllFiles, setShowAllFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('petc_show_all_files');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleShowAll = () => {
    setShowAllFiles(prev => {
      const next = !prev;
      try {
        localStorage.setItem('petc_show_all_files', JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  // Permanent Light Mode (Dark Mode removed per user request)
  const isLight = true;
  const styles = useMemo(() => createStyles(true), []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      try {
        localStorage.setItem('petc_theme', 'light');
      } catch { }
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  // Live Dashboard Statistics for Quick Overview
  const stats = useMemo(() => {
    let totalSales = 0;
    let totalSalesCount = 0;
    let totalIncome = 0;
    let totalIncomeCount = 0;
    let totalExpenses = 0;
    let totalExpensesCount = 0;
    let totalConsumablesCount = 0;

    items.forEach(item => {
      const amt = parseFloat(item.amount) || 0;
      const cat = (item.category || item.categoryId || '').toLowerCase();

      if (cat.includes('sale') || cat.includes('emission') || cat === 'petc-sales' || cat === 'sales') {
        totalSales += amt;
        totalSalesCount++;
      } else if (cat.includes('income') || cat.includes('revenue') || cat.includes('collection') || cat === 'petc-income' || cat === 'income') {
        totalIncome += amt;
        totalIncomeCount++;
      } else if (cat.includes('expense') || cat === 'expenses') {
        totalExpenses += amt;
        totalExpensesCount++;
      } else if (cat.includes('consumable')) {
        totalConsumablesCount++;
      }
    });

    return {
      totalRecords: items.length,
      totalSales,
      totalSalesCount,
      totalIncome,
      totalIncomeCount,
      totalExpenses,
      totalExpensesCount,
      totalConsumablesCount
    };
  }, [items]);

  // Tree expansion state
  const [expandedNodes, setExpandedNodes] = useState({
    'sales': true,
    'income': true,
    'petc-sales': true,
    'petc-sales-2026': false,
    'petc-income': true,
    'petc-income-2026': false,
    'expenses': true,
    'consumables': true,
    'consumables-petc': true,
    'consumables-knoah': true,
    'consumables-redgoose': true,
    'vouchers': true,
    'petc-insurance': true,
    'petc-insurance-2026': false,
  });

  // Document Viewer Modal State
  const [viewItem, setViewItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Lazy-load high-resolution document image if opening an item where filePath wasn't in the initial list query
  useEffect(() => {
    if (!viewItem || viewItem.filePath) return;
    let isCancelled = false;
    const fetchPhoto = async () => {
      try {
        const table = viewItem.sourceTable || 'inventory_items';
        const { data } = await backend.fetchReceiptDetails(table, viewItem.id);
        if (!isCancelled && data && (data.file_path || data.preview_data)) {
          setViewItem(prev => {
            if (!prev || prev.id !== viewItem.id) return prev;
            return {
              ...prev,
              filePath: data.file_path || prev.filePath,
              previewData: data.preview_data || prev.previewData
            };
          });
        }
      } catch (e) {
        console.warn('Lazy photo fetch failed:', e);
      }
    };
    fetchPhoto();
    return () => { isCancelled = true; };
  }, [viewItem?.id]);

  // Add Document Modal State: strictly 'options' | 'insert' | 'scan'
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('options'); // 'options' | 'insert' | 'scan'

  // Insert Document State
  const [insertedFile, setInsertedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Scan Document State
  const [selectedReceiptType, setSelectedReceiptType] = useState(RECEIPT_TYPES[0]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' (rear) | 'user' (front)
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedReceiptPhoto, setCapturedReceiptPhoto] = useState(null);
  const [scannedRefNo, setScannedRefNo] = useState('');
  const [scannedAmount, setScannedAmount] = useState('');
  const [isSavingScan, setIsSavingScan] = useState(false);
  const videoRef = useRef(null);

  // Intelligent OCR States (Establishment, Date, Description, Amount)
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrEstablishment, setOcrEstablishment] = useState('');
  const [ocrReceiptDate, setOcrReceiptDate] = useState('');
  const [ocrDescription, setOcrDescription] = useState('');
  const [ocrAmount, setOcrAmount] = useState('');
  const [ocrOrNumber, setOcrOrNumber] = useState('');
  const [isOcrVerifiedView, setIsOcrVerifiedView] = useState(false);
  const [ocrValidationError, setOcrValidationError] = useState('');
  const [ocrReceiptName, setOcrReceiptName] = useState('');
  const [ocrLineItems, setOcrLineItems] = useState([]);

  // Rename Saved Document State
  const [renameItem, setRenameItem] = useState(null);
  const [renameNewName, setRenameNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Consumables Form State (PETC, Knoah Mari, Red Goose - matching 9 reference columns)
  const [consumableEntity, setConsumableEntity] = useState('Knoah Mari');
  const [consumableItemNo, setConsumableItemNo] = useState('');
  const [consumableDate, setConsumableDate] = useState(new Date().toISOString().split('T')[0]);
  const [consumableName, setConsumableName] = useState('');
  const [consumableSupplier, setConsumableSupplier] = useState('');
  const [consumableOrSiNo, setConsumableOrSiNo] = useState('');
  const [consumableQty, setConsumableQty] = useState('1');
  const [consumableUnit, setConsumableUnit] = useState('pcs');
  const [consumableUnitCost, setConsumableUnitCost] = useState('');
  const [consumableAmount, setConsumableAmount] = useState('');
  const [consumableNotes, setConsumableNotes] = useState('');
  const [consumableStatus, setConsumableStatus] = useState('In Stock');
  const [editingConsumableId, setEditingConsumableId] = useState(null);
  const [isSavingConsumable, setIsSavingConsumable] = useState(false);



  // Current logged in user (Admin or Employee)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = getAuthToken();
      const user = getStoredUser();
      if (!user || !token) {
        setStoredUser(null);
        setAuthToken(null);
        return null;
      }
      // Strictly enforce: Accounts with role === 'admin' have full administrative privileges
      const isActuallyAdmin = user.role === 'admin' || user.isAdmin === true;
      if (!isActuallyAdmin) {
        return {
          ...user,
          role: 'employee',
          isAdmin: false,
          employeeRole: user.employeeRole || (user.role !== 'employee' && user.role !== 'admin' ? user.role : 'Staff')
        };
      }
      return user;
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authAdminEmail, setAuthAdminEmail] = useState('admin@km100.ph');
  const [authAdminPassword, setAuthAdminPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auth Submit Handler
  const handleAuthSubmit = async () => {
    setAuthError('');
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter both your admin email and password.');
      return;
    }

    if (authMode === 'register') {
      if (authPassword.length < 6) {
        setAuthError('Password must be at least 6 characters.');
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthError('Passwords do not match. Please enter a valid admin password.');
        return;
      }
    }

    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        const result = await backend.register({
          name: authFullName.trim() || 'System Admin',
          email: authEmail.trim(),
          password: authPassword,
          role: 'admin',
          authAdminEmail: authAdminEmail.trim() || undefined,
          authAdminPassword: authAdminPassword || undefined,
        });
        if (result.error) {
          setAuthError(typeof result.error === 'string' ? result.error : (result.error.message || 'Registration failed.'));
          return;
        }
        const user = {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.name || 'System Admin',
          role: 'admin',
          isAdmin: true,
          employeeRole: 'Administrator',
          department: 'Administration',
          assignedBranch: 'All',
        };
        setStoredUser(user);
        setCurrentUser(user);
        showNotice(`Admin account created! Welcome, ${user.fullName}`);
        fetchData();
        return;
      } else {
        // Laravel Sanctum Authentication Driver
        const result = await backend.login(authEmail.trim(), authPassword, authPortal);
        if (result.error) {
          setAuthError(typeof result.error === 'string' ? result.error : (result.error.message || 'Login failed.'));
          return;
        }
        const user = {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.name || (result.user.role === 'admin' ? 'Administrator' : 'Staff Member'),
          role: result.user.role,
          isAdmin: result.user.role === 'admin',
          employeeRole: result.user.role === 'admin' ? 'Administrator' : 'Staff',
          department: result.user.department || (result.user.role === 'admin' ? 'Administration' : 'Operations'),
          assignedBranch: result.user.branch || 'All',
        };
        const preCached = loadUserCachedItems(user);
        if (preCached && preCached.length > 0) {
          setItems(preCached);
          setLoading(false);
        }
        setStoredUser(user);
        setCurrentUser(user);
        setCurrentPage('inventory');
        showNotice(`Authenticated as ${user.fullName} (${user.role.toUpperCase()})`);
        fetchData(preCached.length > 0);
        return;
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setAuthError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await backend.logout();
    } catch (err) {
      // ignore
    }
    setStoredUser(null);
    setAuthToken(null);
    setCurrentUser(null);
    setItems([]);
    setCurrentPage('inventory');
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthFullName('');
    setEmpFullName('');
    setEmpEmail('');
    setEmpPassword('');
    setEmpConfirmPassword('');
    showNotice('You have been signed out.');
  };

  // Current active main view / page: 'inventory' | 'admin'
  const [currentPage, setCurrentPage] = useState('inventory');

  // Route & Portal state: 'admin' | 'employee'
  const [authPortal, setAuthPortal] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.includes('employee') || search.includes('employee') || path.includes('/employee')) {
        return 'employee';
      }
    }
    return 'admin';
  });

  const switchAuthPortal = (portal) => {
    setAuthPortal(portal);
    setAuthError('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthFullName('');
    if (typeof window !== 'undefined') {
      window.location.hash = portal === 'employee' ? 'employee' : 'admin';
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('employee')) {
        setAuthPortal('employee');
      } else if (hash.includes('admin')) {
        setAuthPortal('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Employee Profile Modal state for logged-in employees
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  useEffect(() => {
    // If not an admin, ALWAYS force page to 'inventory'
    const isUserAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;
    if (!isUserAdmin && currentPage === 'admin') {
      setCurrentPage('inventory');
    }
  }, [currentUser, currentPage]);

  // Synchronize employee directory from Laravel REST API
  useEffect(() => {
    if (isLaravelDriver() && currentUser?.isAdmin) {
      backend.getEmployees().then(res => {
        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map(u => ({
            id: u.id,
            fullName: u.name,
            email: u.email,
            role: u.role === 'employee' ? (u.department || 'Staff') : u.role,
            department: u.department || u.branch || 'PETC',
            assignedBranch: u.branch || u.department || 'PETC',
            isAdmin: u.role === 'admin',
            createdAt: u.created_at ? u.created_at.split('T')[0] : '2026-03-24',
          }));
          setEmployees(mapped);
          try {
            localStorage.setItem('petc_employee_accounts', JSON.stringify(mapped));
          } catch {}
        }
      }).catch(err => {
        console.warn('Could not load employees from backend:', err);
      });
    }
  }, [currentUser]);

  // Employee Accounts Directory & Creation State
  const [employees, setEmployees] = useState(() => {
    try {
      const raw = localStorage.getItem('petc_employee_accounts');
      if (raw) return JSON.parse(raw);
    } catch { }
    return [];
  });

  const [empFullName, setEmpFullName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empConfirmPassword, setEmpConfirmPassword] = useState('');
  const [empRole, setEmpRole] = useState('Staff / Data Encoder');
  const [empDepartment, setEmpDepartment] = useState('Knoah Mari');
  const [showEmpPassword, setShowEmpPassword] = useState(false);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState('');

  // Employee Account Creation Handler
  const handleCreateEmployee = async () => {
    setEmpError('');
    if (!empFullName.trim()) {
      setEmpError('Please enter the employee full name.');
      return;
    }
    if (!empEmail.trim() || !empEmail.includes('@')) {
      setEmpError('Please enter a valid email address.');
      return;
    }
    if (!empPassword || empPassword.length < 6) {
      setEmpError('Initial password must be at least 6 characters.');
      return;
    }
    if (empPassword !== empConfirmPassword) {
      setEmpError('Passwords do not match.');
      return;
    }

    setEmpLoading(true);
    try {
      let authUserId = null;
      const isAdminAccount = empRole === 'Admin' || empRole === 'admin';
      const branch = isAdminAccount ? 'All' : (empDepartment.includes('Knoah') ? 'Knoah Mari' : (empDepartment.includes('Red Goose') ? 'Red Goose' : 'PETC'));
      const department = isAdminAccount ? 'Administration' : empDepartment;

      if (isAdminAccount) {
        const regRes = await backend.register({
          name: empFullName.trim(),
          email: empEmail.trim(),
          password: empPassword,
          role: 'admin',
          branch: 'All',
          department: 'Administration',
          switchUser: false,
        });
        if (regRes.error) {
          throw new Error(regRes.error);
        }
        if (regRes.user) {
          authUserId = regRes.user.id;
        }
      } else {
        const res = await backend.createEmployee({
          name: empFullName.trim(),
          email: empEmail.trim(),
          password: empPassword,
          branch: branch,
          department: empDepartment,
          is_active: true
        });
        if (res.error) {
          const errMsg = typeof res.error === 'string'
            ? res.error
            : (res.error.data?.message || res.error.message || 'Failed to create employee account in MySQL.');
          throw new Error(errMsg);
        }
        if (res.data) {
          authUserId = res.data.id;
        }
      }

      if (!authUserId) {
        throw new Error('Account was not returned from MySQL database. Please check your admin session.');
      }

      const newEmp = {
        id: authUserId,
        fullName: empFullName.trim(),
        email: empEmail.trim(),
        password: empPassword,
        role: empRole,          // employee or admin role title
        isAdmin: isAdminAccount,
        department: department,
        assignedBranch: branch,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      const updated = [newEmp, ...employees.filter(e => e.email.toLowerCase() !== newEmp.email.toLowerCase())];
      setEmployees(updated);
      try {
        localStorage.setItem('petc_employee_accounts', JSON.stringify(updated));
      } catch { }

      setEmpFullName('');
      setEmpEmail('');
      setEmpPassword('');
      setEmpConfirmPassword('');
      showNotice(`${isAdminAccount ? 'Administrator' : 'Employee'} account successfully created for ${newEmp.fullName}!`);
    } catch (err) {
      setEmpError(err.message || 'Failed to create employee account.');
    } finally {
      setEmpLoading(false);
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to deactivate and remove employee account for "${name}"?`)) {
      if (isLaravelDriver()) {
        try {
          await backend.deleteEmployee(id);
        } catch (e) {
          console.warn('Backend delete employee note:', e);
        }
      }
      const updated = employees.filter(e => e.id !== id);
      setEmployees(updated);
      try {
        localStorage.setItem('petc_employee_accounts', JSON.stringify(updated));
      } catch { }
      showNotice(`Employee account for "${name}" removed.`);
    }
  };

  const ALL_RECEIPT_TABLES = [
    'inventory_items',
    'knoah_mari_expense_receipts',
    'red_goose_expense_receipts',
    'petc_sales_receipts',
    'income_receipts',
    'petc_income_receipts',
    'red_goose_income_receipts',
    'knoah_mari_income_receipts',
    'petc_insurance_receipts',
    'petc_expense_receipts',
    'consumables_receipts',
    'voucher_receipts'
  ];

  // Ref flag to ensure queries never run concurrently + cooldown tracking for maximum API efficiency
  const isFetchingRef = useRef(false);
  const lastSyncAtRef = useRef(0);

  // Lightweight columns for master inventory table to avoid Postgres statement timeout on large base64 image blobs
  const MASTER_INVENTORY_COLUMNS = 'id, file_name, title, category, category_id, sub_category, sub_category_id, entity, year, month, amount, currency, quantity, unit, status, file_format, file_size, notes, tags, created_at, updated_at, establishment, receipt_date, description';

  // Fetch data via Laravel REST API (uses single mirrored master table by default for 92% fewer requests)
  const fetchData = async (silent = false, forceFull = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!silent) setLoading(true);
    setIsSyncing(true);

    try {
      const tablesToQuery = forceFull ? ALL_RECEIPT_TABLES : ['inventory_items'];
      const queries = tablesToQuery.map(table => backend.fetchTable(table));

      const responses = await Promise.allSettled(queries);
      const itemMap = new Map();

      responses.forEach((res, index) => {
        const tableName = tablesToQuery[index];
        if (res.status === 'fulfilled' && res.value && !res.value.error && Array.isArray(res.value.data)) {
          res.value.data.forEach(rawRow => {
            const mapped = mapFromDb(rawRow, tableName);
            if (!mapped || !mapped.id) return;

            if (!itemMap.has(mapped.id)) {
              itemMap.set(mapped.id, { ...mapped, sourceTable: tableName });
            } else {
              // Merge so dedicated table OCR data augments the master record
              const existing = itemMap.get(mapped.id);
              // Ensure genuine non-expense category/entity is strictly preserved
              const finalCategory = (existing.category && existing.category !== 'Expenses') ? existing.category : mapped.category;
              const finalCategoryId = (existing.categoryId && existing.categoryId !== 'expenses') ? existing.categoryId : mapped.categoryId;
              const finalEntity = existing.entity || mapped.entity;

              itemMap.set(mapped.id, {
                ...existing,
                ...mapped,
                category: finalCategory,
                categoryId: finalCategoryId,
                entity: finalEntity,
                filePath: existing.filePath || mapped.filePath || '',
                establishment: mapped.establishment || existing.establishment || '',
                receiptDate: mapped.receiptDate || existing.receiptDate || '',
                description: mapped.description || existing.description || '',
                amount: mapped.amount > 0 ? mapped.amount : existing.amount,
                sourceTable: tableName
              });
            }
          });
        }
      });

      // Update items from database whenever API queries return
      const anySuccess = responses.some(res => res.status === 'fulfilled' && res.value && !res.value.error);
      if (anySuccess) {
        const mergedItems = Array.from(itemMap.values()).sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setItems(mergedItems);
        saveCachedItems(mergedItems, currentUser);
        setCacheSyncLabel('Just now');
        lastSyncAtRef.current = Date.now();
      }
    } catch (err) {
      console.warn('Realtime fetch fallback:', err);
    } finally {
      isFetchingRef.current = false;
      setIsSyncing(false);
      setLoading(false);
    }
  };

  // Watchdog timer: unconditionally guarantee loading screen terminates within 2.5s
  useEffect(() => {
    const watchdog = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(watchdog);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Load active account's scoped cache instantly in 0ms (zero lag)
    const cached = loadUserCachedItems(currentUser);
    const hasCached = cached && cached.length > 0;
    if (hasCached) {
      setItems(cached);
      setLoading(false);
      setCacheSyncLabel(getCacheSyncTime(currentUser));
    }

    // Initial load: fetch silently in background if cache already loaded data
    fetchData(hasCached);

    // 1. Throttled sync when user switches back to browser tab (max once per 60s)
    const handleFocus = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      if (Date.now() - lastSyncAtRef.current >= 60000) {
        fetchData(true);
      }
    };
    window.addEventListener('focus', handleFocus);

    // 2. Low-frequency background sync every 5 minutes (paused when tab is hidden)
    const gentleInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchData(true);
    }, 300000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(gentleInterval);
    };
  }, [currentUser]);

  const showNotice = (msg, type = 'success') => {
    setNotification({ text: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleNode = (nodeKey) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  // Absolute Admin vs Employee Role & Store Access Control
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;
  const isEmployee = !isAdmin && !!currentUser;
  const userDept = (currentUser?.department || currentUser?.assignedBranch || '').toLowerCase();

  const isKnoahEmployee = isEmployee && (userDept.includes('knoah') || userDept === 'knoah mari');
  const isRedGooseEmployee = isEmployee && (userDept.includes('red-goose') || userDept.includes('red goose') || (userDept.includes('red') && !userDept.includes('all')));
  const isPetcEmployee = isEmployee && (userDept === 'petc' || (userDept.includes('petc') && !userDept.includes('all') && !userDept.includes('sales') && !userDept.includes('income')));
  const isConsumablesEmployee = isEmployee && (userDept.includes('consumable') || userDept.includes('supplies') || userDept.includes('office'));
  const isSalesIncomeEmployee = isEmployee && (userDept.includes('sales') || userDept.includes('income'));

  const isKnoahUser = isKnoahEmployee || userDept.includes('knoah');
  const isRedGooseUser = isRedGooseEmployee || userDept.includes('red');
  const isPetcUser = isPetcEmployee || (userDept.includes('petc') || userDept.includes('office'));

  const navSub = (activeNav?.subCategory || '').toLowerCase();
  const isPetcOfficeSupplies = activeNav?.type === 'consumables' && (
    navSub.includes('petc') || navSub.includes('office') || (!activeNav?.subCategory && isPetcUser)
  );
  const isStoreConsumables = activeNav?.type === 'consumables' && (
    (activeNav?.subCategory && (navSub.includes('knoah') || navSub.includes('red'))) ||
    (!activeNav?.subCategory && (isKnoahUser || isRedGooseUser))
  );
  const isAnyConsumables = activeNav?.type === 'consumables';
  const isSalesView = activeNav?.type === 'sales' || activeNav?.type === 'petc-sales';
  const isIncomeView = activeNav?.type === 'income' || activeNav?.type === 'petc-income';
  const isSalesOrIncomeView = isSalesView || isIncomeView;

  // Filter items strictly based on the left sidebar navigation and employee branch scope
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const filteredItems = useMemo(() => {
    // If viewing All Inventory Files and the user has toggled off displaying all files
    if (activeNav.type === 'all' && !showAllFiles) {
      return [];
    }

    return items.filter(item => {
      // 0. STRICT EMPLOYEE STORE & DEPARTMENT ACCESS RESTRICTION
      if (isKnoahEmployee) {
        const itemEntity = (item.entity || '').toLowerCase();
        const itemSub = (item.subCategory || '').toLowerCase();
        const itemTitle = (item.title || item.fileName || '').toLowerCase();
        const isKnoah = itemEntity.includes('knoah') || itemSub.includes('knoah') || itemTitle.includes('knoah');
        if (!isKnoah) return false;
      } else if (isRedGooseEmployee) {
        const itemEntity = (item.entity || '').toLowerCase();
        const itemSub = (item.subCategory || '').toLowerCase();
        const itemTitle = (item.title || item.fileName || '').toLowerCase();
        const isRg = itemEntity.includes('red') || itemSub.includes('red') || itemTitle.includes('red');
        if (!isRg) return false;
      } else if (isPetcEmployee) {
        const itemEntity = (item.entity || '').toLowerCase();
        const itemSub = (item.subCategory || '').toLowerCase();
        const itemTitle = (item.title || item.fileName || '').toLowerCase();
        const isPetc = itemEntity.includes('petc') || itemSub.includes('petc') || itemTitle.includes('petc');
        if (!isPetc) return false;
      } else if (isConsumablesEmployee) {
        const itemCat = (item.category || item.categoryId || '').toLowerCase();
        if (!itemCat.includes('consumable')) return false;
      } else if (isSalesIncomeEmployee) {
        const itemCat = (item.category || item.categoryId || '').toLowerCase();
        if (!itemCat.includes('sale') && !itemCat.includes('income') && !itemCat.includes('emission')) return false;
      }
      // 1. Category Filtering
      const activeType = (activeNav.type || '').toLowerCase();
      if (activeType && activeType !== 'all') {
        const itemCatId = (item.categoryId || '').toLowerCase();
        const itemCat = (item.category || '').toLowerCase();
        const matchesCategory =
          itemCatId === activeType ||
          itemCat === activeType ||
          itemCat.replace(/\s+/g, '-') === activeType ||
          (activeType === 'expenses' && itemCat.includes('expense')) ||
          ((activeType === 'sales' || activeType === 'petc-sales') && (itemCat.includes('sale') || itemCat.includes('emission'))) ||
          ((activeType === 'income' || activeType === 'petc-income') && (itemCat.includes('income') || itemCat.includes('revenue') || itemCat.includes('collection'))) ||
          (activeType === 'petc-insurance' && (itemCat.includes('insurance') || itemCat.includes('ctpl'))) ||
          (activeType === 'consumables' && itemCat.includes('consumable')) ||
          (activeType === 'vouchers' && itemCat.includes('voucher'));

        if (!matchesCategory) return false;
      }

      // 2. Year Filtering
      if (activeNav.year) {
        const itemYear = String(item.year || '');
        if (itemYear && itemYear !== String(activeNav.year)) {
          return false;
        }
      }

      // 3. Month Filtering
      if (activeNav.month) {
        const itemMonth = (item.month || '').toUpperCase();
        const navMonth = String(activeNav.month).toUpperCase();
        if (itemMonth && itemMonth !== navMonth) {
          return false;
        }
      }

      // 4. SubCategory & Branch Filtering (e.g. 'knoah-mari-2026', 'red-goose-2026')
      if (activeNav.subCategory) {
        const target = activeNav.subCategory.toLowerCase();
        const itemSub = (item.subCategory || '').toLowerCase();
        const itemSubId = (item.subCategoryId || '').toLowerCase();
        const itemEntity = (item.entity || '').toLowerCase();
        const itemTitle = (item.title || '').toLowerCase();
        const itemYear = String(item.year || '').toLowerCase();

        // 4.1 Consumables Specific Branch & Supplies Filtering
        if (activeType === 'consumables') {
          if (target === 'all-supplies') {
            return true;
          }
          const isKnoahTarget = target.includes('knoah');
          const isRedGooseTarget = target.includes('red');
          const isPetcTarget = target.includes('petc') || target.includes('office');

          if (isPetcTarget) {
            const matches = itemEntity.includes('petc') || itemSub.includes('petc') || itemSub.includes('office') || itemTitle.includes('office');
            if (!matches) return false;
            return true;
          } else if (isKnoahTarget) {
            const matches = itemEntity.includes('knoah') || itemSub.includes('knoah') || itemTitle.includes('knoah');
            if (!matches) return false;
            return true;
          } else if (isRedGooseTarget) {
            const matches = itemEntity.includes('red') || itemSub.includes('red') || itemTitle.includes('red');
            if (!matches) return false;
            return true;
          }
        }

        // Exact slug match or direct inclusion
        const exactMatch =
          itemSubId === target ||
          itemSub === target ||
          itemSub.replace(/\s+/g, '-') === target ||
          itemSub.replace(/\s+/g, '-').includes(target);

        let matchesSub = exactMatch;
        if (!matchesSub) {
          const isKnoah = target.includes('knoah');
          const isRedGoose = target.includes('red-goose') || target.includes('redgoose');
          const isPetc = target.includes('petc');
          const has2026 = target.includes('2026');
          const has2027 = target.includes('2027');

          if (isKnoah) {
            matchesSub =
              (itemEntity.includes('knoah') || itemSub.includes('knoah') || itemTitle.includes('knoah')) &&
              (!has2026 || !itemYear || itemYear === '2026' || itemSub.includes('2026') || itemTitle.includes('2026')) &&
              (!has2027 || !itemYear || itemYear === '2027' || itemSub.includes('2027') || itemTitle.includes('2027'));
          } else if (isRedGoose) {
            matchesSub =
              (itemEntity.includes('red') || itemSub.includes('red') || itemTitle.includes('red')) &&
              (!has2026 || !itemYear || itemYear === '2026' || itemSub.includes('2026') || itemTitle.includes('2026')) &&
              (!has2027 || !itemYear || itemYear === '2027' || itemSub.includes('2027') || itemTitle.includes('2027'));
          } else if (isPetc) {
            matchesSub =
              (itemEntity.includes('petc') || itemSub.includes('petc') || itemTitle.includes('petc')) &&
              (!has2026 || !itemYear || itemYear === '2026' || itemSub.includes('2026') || itemTitle.includes('2026')) &&
              (!has2027 || !itemYear || itemYear === '2027' || itemSub.includes('2027') || itemTitle.includes('2027'));
          } else {
            const tokens = target.split(/[-_ ]+/).filter(Boolean);
            matchesSub = tokens.every(
              token =>
                itemSub.includes(token) ||
                itemSubId.includes(token) ||
                itemEntity.includes(token) ||
                itemTitle.includes(token)
            );
          }
        }

        if (!matchesSub) return false;
      }

      // 5. Search Query
      if (deferredSearchQuery.trim() !== '') {
        const q = deferredSearchQuery.toLowerCase();
        const inName = item.fileName?.toLowerCase().includes(q);
        const inTitle = item.title?.toLowerCase().includes(q);
        const inEst = item.establishment?.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q);
        const inNotes = item.notes?.toLowerCase().includes(q);
        const inEntity = item.entity?.toLowerCase().includes(q);
        const inSub = item.subCategory?.toLowerCase().includes(q);
        if (!inName && !inTitle && !inEst && !inDesc && !inNotes && !inEntity && !inSub) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeNav, deferredSearchQuery, showAllFiles]);

  // Helper to extract items matching any specific folder navigation node
  const getItemsForFolder = (navTarget) => {
    const nav = navTarget || activeNav;
    if (nav.type === 'all') {
      return items;
    }

    return items.filter(item => {
      // 1. Category Filtering
      const activeType = (nav.type || '').toLowerCase();
      if (activeType && activeType !== 'all') {
        const itemCatId = (item.categoryId || '').toLowerCase();
        const itemCat = (item.category || '').toLowerCase();
        const matchesCategory =
          itemCatId === activeType ||
          itemCat === activeType ||
          itemCat.replace(/\s+/g, '-') === activeType ||
          (activeType === 'expenses' && itemCat.includes('expense')) ||
          ((activeType === 'sales' || activeType === 'petc-sales') && (itemCat.includes('sale') || itemCat.includes('emission'))) ||
          ((activeType === 'income' || activeType === 'petc-income') && (itemCat.includes('income') || itemCat.includes('revenue') || itemCat.includes('collection'))) ||
          (activeType === 'petc-insurance' && (itemCat.includes('insurance') || itemCat.includes('ctpl'))) ||
          (activeType === 'consumables' && itemCat.includes('consumable')) ||
          (activeType === 'vouchers' && itemCat.includes('voucher'));

        if (!matchesCategory) return false;
      }

      // 2. Year Filtering
      if (nav.year) {
        const itemYear = String(item.year || '');
        if (itemYear && itemYear !== String(nav.year)) {
          return false;
        }
      }

      // 3. Month Filtering
      if (nav.month) {
        const itemMonth = (item.month || '').toUpperCase();
        const navMonth = String(nav.month).toUpperCase();
        if (itemMonth && itemMonth !== navMonth) {
          return false;
        }
      }

      // 4. SubCategory & Branch Filtering
      if (nav.subCategory) {
        const target = nav.subCategory.toLowerCase();
        const itemSub = (item.subCategory || '').toLowerCase();
        const itemSubId = (item.subCategoryId || '').toLowerCase();
        const itemEntity = (item.entity || '').toLowerCase();
        const itemTitle = (item.title || '').toLowerCase();
        const itemYear = String(item.year || '').toLowerCase();

        // 4.1 Consumables Specific Branch & Supplies Filtering
        if (activeType === 'consumables') {
          if (target === 'all-supplies') {
            return true;
          }
          const isKnoahTarget = target.includes('knoah');
          const isRedGooseTarget = target.includes('red');
          const isPetcTarget = target.includes('petc') || target.includes('office');

          if (isPetcTarget) {
            const matches = itemEntity.includes('petc') || itemSub.includes('petc') || itemSub.includes('office') || itemTitle.includes('office');
            if (!matches) return false;
            return true;
          } else if (isKnoahTarget) {
            const matches = itemEntity.includes('knoah') || itemSub.includes('knoah') || itemTitle.includes('knoah');
            if (!matches) return false;
            return true;
          } else if (isRedGooseTarget) {
            const matches = itemEntity.includes('red') || itemSub.includes('red') || itemTitle.includes('red');
            if (!matches) return false;
            return true;
          }
        }

        const exactMatch =
          itemSubId === target ||
          itemSub === target ||
          itemSub.replace(/\s+/g, '-') === target ||
          itemSub.replace(/\s+/g, '-').includes(target);

        let matchesSub = exactMatch;
        if (!matchesSub) {
          const isKnoah = target.includes('knoah');
          const isRedGoose = target.includes('red-goose') || target.includes('redgoose');
          const isPetc = target.includes('petc');
          const has2026 = target.includes('2026');
          const has2027 = target.includes('2027');

          if (isKnoah) {
            matchesSub =
              (itemEntity.includes('knoah') || itemSub.includes('knoah') || itemTitle.includes('knoah')) &&
              (!has2026 || !itemYear || itemYear === '2026' || itemSub.includes('2026') || itemTitle.includes('2026')) &&
              (!has2027 || !itemYear || itemYear === '2027' || itemSub.includes('2027') || itemTitle.includes('2027'));
          } else if (isRedGoose) {
            matchesSub =
              (itemEntity.includes('red') || itemSub.includes('red') || itemTitle.includes('red')) &&
              (!has2026 || !itemYear || itemYear === '2026' || itemSub.includes('2026') || itemTitle.includes('2026')) &&
              (!has2027 || !itemYear || itemYear === '2027' || itemSub.includes('2027') || itemTitle.includes('2027'));
          } else if (isPetc) {
            matchesSub =
              (itemEntity.includes('petc') || itemSub.includes('petc') || itemTitle.includes('petc')) &&
              (!has2026 || !itemYear || itemYear === '2026' || itemSub.includes('2026') || itemTitle.includes('2026')) &&
              (!has2027 || !itemYear || itemYear === '2027' || itemSub.includes('2027') || itemTitle.includes('2027'));
          } else {
            const tokens = target.split(/[-_ ]+/).filter(Boolean);
            matchesSub = tokens.every(
              token =>
                itemSub.includes(token) ||
                itemSubId.includes(token) ||
                itemEntity.includes(token) ||
                itemTitle.includes(token)
            );
          }
        }
        if (!matchesSub) return false;
      }

      return true;
    });
  };

  // Export any selected folder's records into a clean, executive formal Excel (.xlsx) file
  const exportFolderToExcel = (targetNav) => {
    const nav = targetNav || activeNav;
    const folderLabel = nav.label || 'Inventory Folder';
    const folderItems = getItemsForFolder(nav);
    exportRecordsToExcel({ folderLabel, folderItems, showNotice });
  };

  // Open & Close Add Document Modal
  const openAddModal = (itemToEdit = null) => {
    setInsertedFile(null);
    setCapturedReceiptPhoto(null);
    setScannedRefNo(`OR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setScannedAmount('');
    setIsSavingScan(false);
    setIsOcrProcessing(false);
    setIsOcrVerifiedView(false);
    setOcrValidationError('');
    setOcrReceiptName('');
    setOcrEstablishment('');
    setOcrReceiptDate('');
    setOcrDescription('');
    setOcrAmount('');
    setOcrOrNumber('');
    stopCamera();

    // If editing an existing consumable item (guard against React SyntheticEvent / DOM Event)
    const isRealItem = itemToEdit && typeof itemToEdit === 'object' && !itemToEdit.nativeEvent && !itemToEdit.preventDefault && (itemToEdit.id !== undefined || itemToEdit.fileName !== undefined || itemToEdit.title !== undefined);
    if (isRealItem) {
      const preview = itemToEdit.previewData || {};
      setEditingConsumableId(itemToEdit.id);
      setConsumableEntity(itemToEdit.entity || 'PETC');
      setConsumableItemNo(itemToEdit.itemNo || preview.itemNo || '');
      setConsumableDate(itemToEdit.receiptDate || preview.date || new Date().toISOString().split('T')[0]);
      setConsumableName(itemToEdit.title || preview.particulars || itemToEdit.fileName?.replace(/\.item$/i, '') || '');
      setConsumableSupplier(itemToEdit.supplier || preview.supplier || (itemToEdit.establishment !== itemToEdit.entity ? itemToEdit.establishment : '') || '');
      setConsumableOrSiNo(itemToEdit.orSiNo || preview.orSiNo || preview.or_si_no || '');
      setConsumableQty(String(itemToEdit.quantity || preview.quantity || 1));
      setConsumableUnit(itemToEdit.unit || preview.unitMeasure || 'pcs');
      setConsumableUnitCost(String(itemToEdit.unitCost || preview.unitCost || ''));
      setConsumableAmount(String(itemToEdit.amount || preview.amount || ''));
      setConsumableNotes(itemToEdit.notes || preview.notes || '');
      setConsumableStatus(itemToEdit.status || 'In Stock');
      setAddMode('store-consumable');
      setShowAddModal(true);
      return;
    }

    setEditingConsumableId(null);

    if (isAnyConsumables) {
      setAddMode('store-consumable');
      let targetEntity = 'PETC';
      if (navSub.includes('red') || isRedGooseEmployee) {
        targetEntity = 'Red Goose';
      } else if (navSub.includes('knoah') || isKnoahEmployee) {
        targetEntity = 'Knoah Mari';
      } else if (navSub.includes('petc') || navSub.includes('office') || isPetcEmployee) {
        targetEntity = 'PETC';
      }
      const entityConsumables = items.filter(i =>
        (i.category === 'Consumables' || i.categoryId === 'consumables') &&
        (i.entity || '').toLowerCase() === targetEntity.toLowerCase()
      );
      setConsumableEntity(targetEntity);
      setConsumableItemNo(String(entityConsumables.length + 1));
      setConsumableDate(new Date().toISOString().split('T')[0]);
      setConsumableName('');
      setConsumableSupplier('');
      setConsumableOrSiNo('');
      setConsumableQty('1');
      setConsumableUnit('pcs');
      setConsumableUnitCost('');
      setConsumableAmount('');
      setConsumableNotes('');
      setConsumableStatus('In Stock');
      setShowAddModal(true);
      return;
    }

    setAddMode('options');

    // Auto-select receipt classification based on current active navigation context
    if (isKnoahEmployee) {
      if (activeNav.type === 'sales' || activeNav.type === 'petc-sales') {
        const match = RECEIPT_TYPES.find(r => r.id === 'knoah-mari-sales');
        if (match) setSelectedReceiptType(match);
      } else if (activeNav.type === 'income' || activeNav.type === 'petc-income') {
        const match = RECEIPT_TYPES.find(r => r.id === 'knoah-mari-income');
        if (match) setSelectedReceiptType(match);
      } else {
        const match = RECEIPT_TYPES.find(r => r.id === 'expenses-knoah-mari');
        if (match) setSelectedReceiptType(match);
      }
    } else if (isRedGooseEmployee) {
      if (activeNav.type === 'sales' || activeNav.type === 'petc-sales') {
        const match = RECEIPT_TYPES.find(r => r.id === 'red-goose-sales');
        if (match) setSelectedReceiptType(match);
      } else if (activeNav.type === 'income' || activeNav.type === 'petc-income') {
        const match = RECEIPT_TYPES.find(r => r.id === 'red-goose-income');
        if (match) setSelectedReceiptType(match);
      } else {
        const match = RECEIPT_TYPES.find(r => r.id === 'expenses-red-goose');
        if (match) setSelectedReceiptType(match);
      }
    } else if (activeNav.type === 'sales' || activeNav.type === 'petc-sales') {
      let salesId = 'petc-sales';
      const sub = (activeNav.subCategory || '').toLowerCase();
      if (sub.includes('red')) salesId = 'red-goose-sales';
      else if (sub.includes('knoah')) salesId = 'knoah-mari-sales';
      const match = RECEIPT_TYPES.find(r => r.id === salesId) || RECEIPT_TYPES.find(r => r.id === 'petc-sales');
      if (match) setSelectedReceiptType(match);
    } else if (activeNav.type === 'income' || activeNav.type === 'petc-income') {
      let incomeId = 'petc-income';
      const sub = (activeNav.subCategory || '').toLowerCase();
      if (sub.includes('red')) incomeId = 'red-goose-income';
      else if (sub.includes('knoah')) incomeId = 'knoah-mari-income';
      const match = RECEIPT_TYPES.find(r => r.id === incomeId) || RECEIPT_TYPES.find(r => r.id === 'petc-income');
      if (match) setSelectedReceiptType(match);
    } else if (activeNav.type === 'petc-insurance') {
      const match = RECEIPT_TYPES.find(r => r.id === 'petc-insurance');
      if (match) setSelectedReceiptType(match);
    } else if (activeNav.type === 'expenses') {
      let expenseId = 'expenses-petc';
      if (activeNav.subCategory?.includes('Red Goose') || activeNav.subCategory?.toLowerCase().includes('red')) {
        expenseId = 'expenses-red-goose';
      } else if (activeNav.subCategory?.includes('Knoah Mari') || activeNav.subCategory?.toLowerCase().includes('knoah')) {
        expenseId = 'expenses-knoah-mari';
      }
      const match = RECEIPT_TYPES.find(r => r.id === expenseId);
      if (match) setSelectedReceiptType(match);
    } else if (activeNav.type === 'consumables') {
      let receiptId = 'consumables-petc-office';
      const sub = (activeNav.subCategory || '').toLowerCase();
      if (sub.includes('knoah')) {
        receiptId = 'consumables-knoah-mari-store';
      } else if (sub.includes('red')) {
        receiptId = 'consumables-red-goose-store';
      }
      const match = RECEIPT_TYPES.find(r => r.id === receiptId) || RECEIPT_TYPES.find(r => r.category === 'Consumables');
      if (match) setSelectedReceiptType(match);
    } else if (activeNav.type === 'vouchers') {
      const match = RECEIPT_TYPES.find(r => r.id === 'voucher-disbursement');
      if (match) setSelectedReceiptType(match);
    }

    setShowAddModal(true);
  };

  const closeAddModal = () => {
    stopCamera();
    setShowAddModal(false);
  };

  // --- Consumables Handler (PETC, Knoah Mari & Red Goose) ---
  const handleSaveStoreConsumable = async () => {
    if (!consumableName || !consumableName.trim()) {
      showNotice('Please enter particulars / item name for the consumable.');
      return;
    }
    setIsSavingConsumable(true);
    try {
      const isEditing = Boolean(editingConsumableId);
      const id = editingConsumableId || `CNS-${Date.now()}`;
      const itemName = consumableName.trim();
      const numQty = parseFloat(consumableQty) || 1;
      const numUnitCost = parseFloat(consumableUnitCost) || 0;
      const numAmount = parseFloat(consumableAmount) || (numQty * numUnitCost) || 0;
      const recordDate = consumableDate || new Date().toISOString().split('T')[0];
      const recordEntity = consumableEntity || (isPetcOfficeSupplies ? 'PETC' : isRedGooseEmployee ? 'Red Goose' : 'Knoah Mari');
      const subCategoryName = recordEntity === 'PETC' ? 'Office supplies' : 'Store Consumables';
      const subId = recordEntity === 'PETC'
        ? 'petc-office-supplies'
        : recordEntity.toLowerCase().includes('red')
          ? 'red-goose-store-consumables'
          : 'knoah-mari-store-consumables';

      const existingConsumables = items.filter(i =>
        (i.category === 'Consumables' || i.categoryId === 'consumables') &&
        (i.entity || '').toLowerCase() === recordEntity.toLowerCase()
      );
      const itemNoVal = consumableItemNo || String(existingConsumables.length + (isEditing ? 0 : 1));

      const previewData = {
        itemNo: itemNoVal,
        particulars: itemName,
        supplier: consumableSupplier.trim(),
        orSiNo: consumableOrSiNo.trim(),
        date: recordDate,
        quantity: numQty,
        unitMeasure: consumableUnit || 'pcs',
        unitCost: numUnitCost,
        amount: numAmount,
        establishment: recordEntity,
        category: `Consumables > ${subCategoryName}`,
        notes: consumableNotes.trim(),
        status: consumableStatus || 'In Stock'
      };

      const record = {
        id,
        table: 'consumables_receipts',
        file_name: `${itemName}.item`,
        title: itemName,
        establishment: consumableSupplier.trim() || recordEntity,
        receipt_date: recordDate,
        category: 'Consumables',
        category_id: 'consumables',
        sub_category: subCategoryName,
        sub_category_id: subId,
        entity: recordEntity,
        year: recordDate.split('-')[0] || String(new Date().getFullYear()),
        month: new Date(recordDate).toLocaleString('default', { month: 'short' }).toUpperCase(),
        amount: numAmount,
        quantity: numQty,
        unit: consumableUnit || 'pcs',
        status: consumableStatus || 'In Stock',
        file_format: 'ITEM',
        file_size: '1 KB',
        description: `OR/SI: ${consumableOrSiNo.trim() || '-'} | Supplier: ${consumableSupplier.trim() || '-'} | ${itemName} (${numQty} ${consumableUnit || 'pcs'} @ ₱${numUnitCost})`,
        notes: `Supplier: ${consumableSupplier.trim()} | OR/SI No: ${consumableOrSiNo.trim()}${consumableNotes.trim() ? ' | ' + consumableNotes.trim() : ''}`,
        preview_data: previewData
      };

      if (isLaravelDriver()) {
        const res = isEditing
          ? await backend.updateReceipt(id, 'consumables_receipts', record)
          : await backend.createReceipt(record, 'consumables_receipts');
        if (res?.error) {
          throw new Error(res.error?.data?.message || res.error?.message || 'Failed to save consumable to database');
        }
      }

      const mappedItem = mapFromDb(record, 'consumables_receipts');
      mappedItem.previewData = previewData;
      mappedItem.supplier = consumableSupplier.trim();
      mappedItem.orSiNo = consumableOrSiNo.trim();
      mappedItem.unitCost = numUnitCost;
      mappedItem.itemNo = itemNoVal;

      setItems(prev => {
        const next = [mappedItem, ...prev.filter(i => i.id !== id)];
        saveCachedItems(next, currentUser);
        return next;
      });
      closeAddModal();
      showNotice(`${recordEntity === 'PETC' ? 'Office supply' : 'Consumable'} "${itemName}" ${isEditing ? 'updated' : 'saved'} successfully!`);
    } catch (err) {
      console.error('Failed to save consumable:', err);
      showNotice(`Error saving consumable: ${err.message || 'Server error'}`);
    } finally {
      setIsSavingConsumable(false);
      setEditingConsumableId(null);
    }
  };

  // --- Daily Sales / Income Handler (Calendar-based, no receipts) ---
  const handleSaveDailySalesIncome = async ({ id, mode, entity, date, amount, notes }) => {
    try {
      const isSales = mode === 'sales';
      const isEditing = Boolean(id);
      const recordId = id || `${isSales ? 'SLS' : 'INC'}-${Date.now()}`;
      const recordDate = date || new Date().toISOString().split('T')[0];
      const year = recordDate.split('-')[0] || String(new Date().getFullYear());
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthIdx = (parseInt(recordDate.split('-')[1], 10) || 1) - 1;
      const month = monthNames[monthIdx] || 'JAN';
      const ent = entity || 'PETC';
      const entLower = ent.toLowerCase();

      let subCategory = '';
      let subCategoryId = '';
      if (isSales) {
        if (entLower.includes('red')) {
          subCategory = 'Red Goose Sales 2026';
          subCategoryId = 'red-goose-sales-2026';
        } else if (entLower.includes('knoah')) {
          subCategory = 'Knoah Mari Sales 2026';
          subCategoryId = 'knoah-mari-sales-2026';
        } else {
          subCategory = 'Sales 2026 (PETC)';
          subCategoryId = 'sales-2026-petc';
        }
      } else {
        if (entLower.includes('red')) {
          subCategory = 'Red Goose Income 2026';
          subCategoryId = 'red-goose-income-2026';
        } else if (entLower.includes('knoah')) {
          subCategory = 'Knoah Mari Income 2026';
          subCategoryId = 'knoah-mari-income-2026';
        } else {
          subCategory = 'Income 2026 (PETC)';
          subCategoryId = 'income-2026-petc';
        }
      }

      const targetTable = isSales
        ? (ent === 'PETC' ? 'petc_sales_receipts' : 'inventory_items')
        : entLower.includes('red')
          ? 'red_goose_income_receipts'
          : entLower.includes('knoah')
            ? 'knoah_mari_income_receipts'
            : 'petc_income_receipts';
      const labelType = isSales ? 'Daily Sales' : 'Daily Income';
      const titleText = `${ent} ${labelType} (${recordDate})`;
      const fileName = `${isSales ? 'SALES' : 'INC'}_${ent.replace(/\s+/g, '_').toUpperCase()}_${recordDate}.daily`;

      const record = {
        id: recordId,
        table: targetTable,
        file_name: fileName,
        title: titleText,
        establishment: ent,
        receipt_date: recordDate,
        category: isSales ? 'Sales' : 'Income',
        category_id: isSales ? 'sales' : 'income',
        sub_category: subCategory,
        sub_category_id: subCategoryId,
        entity: ent,
        year,
        month,
        amount: parseFloat(amount) || 0,
        quantity: 1,
        unit: 'day',
        status: 'Recorded',
        file_format: 'DAILY',
        file_size: '1 KB',
        description: notes || `${labelType} recorded for ${ent} on ${recordDate}`,
        notes: notes || '',
        preview_data: {
          establishment: ent,
          receipt_date: recordDate,
          amount: parseFloat(amount) || 0,
          description: notes || `${labelType} for ${ent}`,
          entry_type: 'daily_calendar'
        }
      };

      if (isLaravelDriver()) {
        const res = isEditing
          ? await backend.updateReceipt(recordId, targetTable, record)
          : await backend.createReceipt(record, targetTable);
        if (res?.error) {
          throw new Error(res.error?.data?.message || res.error?.message || 'Failed to save daily entry to database');
        }
      }

      const mapped = mapFromDb(record, targetTable);
      setItems(prev => {
        const next = [mapped, ...prev.filter(i => i.id !== recordId)];
        saveCachedItems(next, currentUser);
        return next;
      });
      showNotice(`${labelType} for ${ent} (${recordDate}) ${isEditing ? 'updated' : 'saved'}!`);
    } catch (err) {
      console.error('Failed to save daily sales/income:', err);
      showNotice(`Error saving daily entry: ${err.message || 'Server error'}`);
    }
  };

  // --- Option 1: Insert Document Handlers ---
  const handleDeviceFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setInsertedFile(file);
    }
  };

  const handleSaveInsertedFile = async () => {
    if (!insertedFile) return;
    setIsUploading(true);

    try {
      // 1. Upload to backend storage if applicable
      try {
        await backend.uploadFile(insertedFile, 'documents');
      } catch (e) {
        // file upload optional if base64 preview preserved
      }

      // Target category based on active sidebar selection
      let targetCategory = 'PETC Sales';
      let targetCategoryId = 'petc-sales';
      let targetEntity = 'PETC';
      let targetSubCategory = '';
      let targetYear = activeNav.year;
      let targetMonth = activeNav.month;

      if (activeNav.type === 'sales' || activeNav.type === 'petc-sales') {
        targetCategory = 'Sales';
        targetCategoryId = 'sales';
        targetSubCategory = activeNav.subCategory || 'Sales 2026 (PETC)';
        targetEntity = activeNav.subCategory?.toLowerCase().includes('red') ? 'Red Goose' : activeNav.subCategory?.toLowerCase().includes('knoah') ? 'Knoah Mari' : 'PETC';
      } else if (activeNav.type === 'income' || activeNav.type === 'petc-income') {
        targetCategory = 'Income';
        targetCategoryId = 'income';
        targetSubCategory = activeNav.subCategory || 'Income 2026 (PETC)';
        targetEntity = activeNav.subCategory?.toLowerCase().includes('red') ? 'Red Goose' : activeNav.subCategory?.toLowerCase().includes('knoah') ? 'Knoah Mari' : 'PETC';
      } else if (activeNav.type === 'expenses') {
        targetCategory = 'Expenses';
        targetCategoryId = 'expenses';
        targetSubCategory = activeNav.subCategory || 'Expenses 2026 (PETC)';
        targetEntity = activeNav.subCategory?.includes('Red Goose') ? 'Red Goose' : activeNav.subCategory?.includes('Knoah Mari') ? 'Knoah Mari' : 'PETC';
      } else if (activeNav.type === 'consumables') {
        targetCategory = 'Consumables';
        targetCategoryId = 'consumables';
        targetSubCategory = activeNav.subCategory || 'Office supply';
        targetEntity = 'General';
      } else if (activeNav.type === 'vouchers') {
        targetCategory = 'Vouchers';
        targetCategoryId = 'vouchers';
        targetSubCategory = activeNav.subCategory;
        targetEntity = activeNav.subCategory;
      } else if (activeNav.type === 'petc-insurance') {
        targetCategory = 'PETC Insurance';
        targetCategoryId = 'petc-insurance';
        targetEntity = 'PETC';
      }

      const fileExt = insertedFile.name.includes('.') ? insertedFile.name.split('.').pop().toUpperCase() : 'PDF';

      let uploadedFilePath = null;
      if (isLaravelDriver() && insertedFile instanceof File) {
        try {
          const uploadRes = await backend.uploadFile(insertedFile, 'documents');
          if (uploadRes?.data?.file_path) {
            uploadedFilePath = uploadRes.data.file_path;
          }
        } catch (upErr) {
          console.warn('[Storage] File upload note:', upErr);
        }
      }

      const newItemPayload = {
        id: `DOC-${Date.now()}`,
        fileName: insertedFile.name,
        filePath: uploadedFilePath || null,
        title: insertedFile.name.replace(/\.[^/.]+$/, ''),
        category: targetCategory,
        categoryId: targetCategoryId,
        subCategory: targetSubCategory || targetMonth,
        entity: targetEntity,
        year: targetYear,
        month: targetMonth,
        amount: 0,
        currency: 'PHP',
        quantity: 1,
        unit: 'document',
        status: 'Active',
        fileFormat: fileExt,
        fileSize: `${(insertedFile.size / 1024).toFixed(1)} KB`,
        notes: `Document inserted from device storage on ${new Date().toLocaleDateString()}. Destination: ${activeNav.label}`,
        tags: [targetCategory, targetEntity, fileExt]
      };

      // Save document record to MySQL database via Laravel REST API
      const dbRow = mapToDb(newItemPayload);
      await backend.saveReceipt('inventory_items', dbRow);

      // Optimistically update state & persist to system cache immediately
      setItems(prev => {
        const next = [newItemPayload, ...prev.filter(i => i.id !== newItemPayload.id)];
        saveCachedItems(next);
        return next;
      });

      showNotice(`File "${insertedFile.name}" inserted and cataloged!`);
      closeAddModal();
      fetchData(true);
    } catch (err) {
      console.error(err);
      showNotice('Failed to upload and save document', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // --- Option 2: Scan Receipt Handlers ---
  const startCamera = async (facing = cameraFacing) => {
    stopCamera();
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (e1) {
        // Fallback to any available camera without constraint
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.setAttribute('muted', 'true');
        await videoRef.current.play().catch(e => console.warn('Video play warning:', e));
      }
      setCameraStream(stream);
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      showNotice('Camera not accessible. Please allow camera permissions or upload a receipt photo.');
    }
  };

  // Ensure video element receives the active MediaStream after mounting
  useEffect(() => {
    if (cameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('autoplay', 'true');
      videoRef.current.setAttribute('muted', 'true');
      videoRef.current.play().catch(e => console.warn('Video play warning:', e));
    }
  }, [cameraActive, cameraStream]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  const flipCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Helper to downscale and compress mobile camera photos to ~150KB for fast storage upload
  // Helper to downscale and compress camera photos to ~80KB for lightning-fast processing
  const compressReceiptImage = (fileOrDataUrl, maxDim = 1000, quality = 0.7) => {
    return new Promise((resolve) => {
      const ImgConstructor = typeof window !== 'undefined' && window.Image ? window.Image : Image;
      const img = new ImgConstructor();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null);
      };

      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(fileOrDataUrl);
      }
    });
  };

  // Handle OCR processing when image is snapped or uploaded (guaranteed fast response under 2s)
  const handleProcessReceiptPhoto = async (dataUrl) => {
    setCapturedReceiptPhoto(dataUrl);
    setIsOcrProcessing(true);
    setOcrStatusText('Reading receipt data...');
    setOcrProgress(0.25);
    stopCamera();

    let finished = false;

    // Apply whatever details were ACTUALLY extracted from the scanned image (NO hardcoded data)
    const applyOcrResult = (parsed) => {
      // 1. Strict Validation: Check if the image was identified as NOT a receipt or API key error
      if (parsed && parsed.isReceipt === false) {
        setIsOcrProcessing(false);
        setIsOcrVerifiedView(false);
        setOcrValidationError(parsed.rejectionReason || 'The scanned image is not a recognized official receipt, invoice, or voucher.');
        if (parsed.isApiKeyError) {
          showNotice('AI Vision Error: Google Cloud service account is inactive.', 'error');
        } else {
          showNotice('Scan Rejected: The photo is not a receipt and cannot be saved.');
        }
        return;
      }

      // 2. Secondary verification: ensure valid receipt data exists
      const parsedAmt = parsed?.amount ? parseFloat(parsed.amount) : 0;
      const parsedEst = (parsed?.establishment || '').trim();
      const parsedOr = (parsed?.orNumber || '').trim();

      const hasReceiptData = Boolean((parsedEst.length >= 2) || (parsedAmt > 0) || (parsedOr.length >= 2));
      if (!hasReceiptData) {
        setIsOcrProcessing(false);
        setIsOcrVerifiedView(false);
        setOcrValidationError('Unable to detect any valid receipt data (establishment, amount, or invoice number). Please take a clearer photo of an official receipt.');
        showNotice('Scan Rejected: No receipt data found in photo.');
        return;
      }

      // Valid receipt detected! Clear any validation error and proceed to review
      setOcrValidationError('');
      setOcrEstablishment(parsedEst || (selectedReceiptType?.entity ? `${selectedReceiptType.entity} Testing Center` : ''));
      setOcrReceiptDate(parsed?.receiptDate || new Date().toISOString().split('T')[0]);

      // Default description MUST match the user's selected receipt classification!
      let defaultDesc = selectedReceiptType?.name || 'Official Receipt';
      if (selectedReceiptType?.id === 'petc-sales') {
        defaultDesc = 'Vehicle Emission Testing Sales';
      } else if (selectedReceiptType?.id === 'petc-income') {
        defaultDesc = 'Daily Collection / Revenue';
      } else if (selectedReceiptType?.id === 'petc-insurance') {
        defaultDesc = 'PETC CTPL Insurance Payment';
      } else if (selectedReceiptType?.id === 'consumables-delivery') {
        defaultDesc = 'Office & Testing Supplies';
      } else if (selectedReceiptType?.id === 'voucher-disbursement') {
        defaultDesc = 'Petty Cash Payment Voucher';
      } else if (selectedReceiptType?.categoryId === 'expenses') {
        defaultDesc = `${selectedReceiptType.entity || 'PETC'} Operational Expense`;
      }

      setOcrDescription(parsed?.description || defaultDesc);
      setOcrAmount(parsedAmt > 0 ? parsedAmt.toString() : '');
      setOcrOrNumber(parsedOr);

      const refCode = (parsedOr || `${Math.floor(1000 + Math.random() * 9000)}`).trim();
      const defaultName = `Scanned_${selectedReceiptType?.prefix || 'REC'}_${refCode}`;
      setOcrReceiptName(defaultName);
      setOcrLineItems(Array.isArray(parsed?.lineItems) ? parsed.lineItems : []);

      setIsOcrProcessing(false);
      setIsOcrVerifiedView(true);
      showNotice(`Receipt verified as ${selectedReceiptType?.name}! Please review details.`);
    };

    // Safety fallback: maximum 12 seconds wait time for AI recognition
    const safetyTimer = setTimeout(() => {
      if (!finished) {
        finished = true;
        applyOcrResult(null);
      }
    }, 12000);

    try {
      const parsed = await runOcrOnImage(dataUrl, (prog, msg) => {
        setOcrProgress(prog);
        setOcrStatusText(msg);
      }, selectedReceiptType);

      if (!finished) {
        finished = true;
        clearTimeout(safetyTimer);
        applyOcrResult(parsed);
      }
    } catch (err) {
      console.warn('OCR processing error:', err);
      if (!finished) {
        finished = true;
        clearTimeout(safetyTimer);
        applyOcrResult(null);
      }
    }
  };

  // Save the verified receipt data into its dedicated database table
  const saveVerifiedReceiptToDatabase = async () => {
    if (!capturedReceiptPhoto) {
      showNotice('Please capture or select a receipt photo first', 'error');
      return;
    }

    if (ocrValidationError) {
      showNotice('Cannot save: The scanned photo was rejected as not a receipt.', 'error');
      return;
    }

    const amt = parseFloat(ocrAmount) || 0;
    const est = (ocrEstablishment || '').trim();
    const orNum = (ocrOrNumber || '').trim();

    // Strict validation: Reject if there are no valid receipt details at all
    if (!est && amt <= 0 && !orNum) {
      showNotice('Cannot save: No valid receipt details found. The system does not allow saving non-receipt photos.', 'error');
      return;
    }

    setIsSavingScan(true);
    try {
      const establishment = (ocrEstablishment || (selectedReceiptType.entity ? `${selectedReceiptType.entity} Center` : 'Official Store')).trim();
      const receiptDate = (ocrReceiptDate || new Date().toISOString().split('T')[0]).trim();

      let fallbackDesc = selectedReceiptType.name || 'Official Receipt';
      if (selectedReceiptType.id === 'petc-sales') fallbackDesc = 'Vehicle Emission Testing Sales';
      else if (selectedReceiptType.id === 'petc-income') fallbackDesc = 'Daily Collection / Revenue';
      else if (selectedReceiptType.id === 'petc-insurance') fallbackDesc = 'PETC CTPL Insurance Payment';
      else if (selectedReceiptType.id === 'consumables-delivery') fallbackDesc = 'Office & Testing Supplies';
      else if (selectedReceiptType.id === 'voucher-disbursement') fallbackDesc = 'Petty Cash Payment Voucher';
      else if (selectedReceiptType.categoryId === 'expenses') fallbackDesc = `${selectedReceiptType.entity || 'PETC'} Operational Expense`;

      const description = (ocrDescription || fallbackDesc).trim();
      const amt = parseFloat(ocrAmount) || 0;
      const refCode = (ocrOrNumber || `${Math.floor(1000 + Math.random() * 9000)}`).trim();

      let rawCustomName = (ocrReceiptName || '').trim();
      let receiptFileName = '';
      let receiptTitle = '';

      if (rawCustomName) {
        receiptFileName = rawCustomName.match(/\.(jpg|jpeg|png|pdf)$/i)
          ? rawCustomName
          : `${rawCustomName}.jpg`;
        receiptTitle = rawCustomName.replace(/\.[^/.]+$/, '');
      } else {
        receiptFileName = `Scanned_${selectedReceiptType.prefix}_${refCode}.jpg`;
        receiptTitle = `${establishment} - ${description}`;
      }

      const scanDateToday = new Date().toISOString().split('T')[0];
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const currentMonthName = monthNames[new Date().getMonth()];

      const targetYear = activeNav.year || scanDateToday.split('-')[0];
      const targetMonth = activeNav.month || currentMonthName;

      let targetSubCat = selectedReceiptType.subCategory || 'Receipt Scan';
      if (selectedReceiptType.categoryId === 'petc-sales' || selectedReceiptType.categoryId === 'sales') {
        targetSubCat = selectedReceiptType.subCategory || (targetMonth ? `Sales ${targetYear} (${targetMonth})` : 'Sales Receipt');
      } else if (selectedReceiptType.categoryId === 'petc-income' || selectedReceiptType.categoryId === 'income') {
        targetSubCat = selectedReceiptType.subCategory || (targetMonth ? `Income ${targetYear} (${targetMonth})` : 'Daily Collection');
      }

      const scannedItemPayload = {
        id: `SCN-${Date.now()}`,
        fileName: receiptFileName,
        title: receiptTitle,
        establishment,
        receiptDate,
        scannedDate: scanDateToday,
        description,
        category: selectedReceiptType.category,
        categoryId: selectedReceiptType.categoryId,
        subCategory: targetSubCat,
        entity: selectedReceiptType.entity,
        year: targetYear,
        month: targetMonth,
        amount: amt,
        currency: 'PHP',
        quantity: 1,
        unit: 'receipt',
        status: 'Scanned & Verified',
        fileFormat: 'JPG',
        fileSize: `${Math.round(capturedReceiptPhoto.length * 0.75 / 1024)} KB`,
        filePath: capturedReceiptPhoto,
        lineItems: ocrLineItems,
        notes: `Establishment: ${establishment} | Scanned: ${scanDateToday} | Date: ${receiptDate} | Classification: ${selectedReceiptType.name} | Category: ${selectedReceiptType.category} | Description: ${description} | Amount: PHP ${amt.toLocaleString()} | Reference: ${refCode}.${ocrLineItems.length > 0 ? ` | Items (${ocrLineItems.length}): ${ocrLineItems.map(i => `${i.qty ? i.qty + ' ' : ''}${i.name}`).join(', ')}` : ''}`,
        tags: ['Scanned Receipt', establishment, selectedReceiptType.name, selectedReceiptType.entity, selectedReceiptType.category],
        previewData: {
          establishment,
          receipt_date: receiptDate,
          description,
          amount: amt,
          or_number: refCode,
          category: selectedReceiptType.category,
          entity: selectedReceiptType.entity,
          lineItems: ocrLineItems,
          columns: ['Receipt Field', 'Extracted Value'],
          rows: [
            ['Establishment', establishment],
            ['Receipt Date', receiptDate],
            ['Description', description],
            ['Total Amount', amt > 0 ? `PHP ${amt.toLocaleString()}` : 'Unspecified'],
            ['Official Ref / Invoice No.', refCode],
            ...(ocrLineItems.length > 0 ? [['Itemized Entries', `${ocrLineItems.length} listed items verified`]] : []),
            ['Assigned Category', selectedReceiptType.category],
            ['Assigned Entity', selectedReceiptType.entity],
            ['Scan Timestamp', new Date().toLocaleString()]
          ],
          summary: {
            'Establishment': establishment,
            'Receipt Date': receiptDate,
            'Category': selectedReceiptType.category,
            'Entity': selectedReceiptType.entity,
            'Total Amount': amt > 0 ? `PHP ${amt.toLocaleString()}` : 'N/A',
            'Official Ref': refCode,
            ...(ocrLineItems.length > 0 ? { 'Listed Items': `${ocrLineItems.length} items` } : {})
          }
        }
      };

      // 1. Direct Laravel MySQL API upsert to dedicated receipt table (e.g. petc_sales_receipts, knoah_mari_expense_receipts)
      const targetTable = selectedReceiptType.tableName;
      if (targetTable && targetTable !== 'inventory_items') {
        let dedicatedRecord = {
          id: scannedItemPayload.id,
          or_number: refCode,
          file_name: receiptFileName,
          title: scannedItemPayload.title,
          establishment,
          receipt_date: receiptDate,
          description,
          category: scannedItemPayload.category,
          entity: scannedItemPayload.entity,
          year: scannedItemPayload.year,
          month: scannedItemPayload.month,
          amount: amt,
          currency: 'PHP',
          status: 'Scanned & Verified',
          file_format: 'JPG',
          file_size: scannedItemPayload.fileSize,
          file_path: capturedReceiptPhoto,
          notes: scannedItemPayload.notes,
          tags: scannedItemPayload.tags,
          preview_data: scannedItemPayload.previewData,
          scanned_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (targetTable.includes('expense') || targetTable.includes('consumables') || targetTable.includes('voucher')) {
          dedicatedRecord.sub_category = scannedItemPayload.subCategory;
        }

        const { error: dedicatedErr } = await backend.saveReceipt(targetTable, dedicatedRecord);
        if (dedicatedErr) {
          console.error(`Dedicated table "${targetTable}" error:`, dedicatedErr);
        }
      }

      // 2. Mirror into master inventory_items in MySQL
      try {
        const dbRow = mapToDb(scannedItemPayload);
        await backend.saveReceipt('inventory_items', dbRow);
      } catch (mirrorErr) {
        console.warn('Master inventory mirror error:', mirrorErr);
      }

      // 3. Update local state immediately & persist to system cache
      setItems(prev => {
        const next = [scannedItemPayload, ...prev.filter(i => i.id !== scannedItemPayload.id)];
        saveCachedItems(next);
        return next;
      });

      // 4. Success feedback and close modal IMMEDIATELY
      stopCamera();
      closeAddModal();
      showNotice(`Receipt from "${establishment}" (PHP ${amt.toLocaleString()}) saved as ${selectedReceiptType.category}!`);
      fetchData(true);
    } catch (err) {
      console.error('Error saving scanned receipt:', err);
      showNotice('Failed to save scanned receipt: ' + (err.message || err), 'error');
    } finally {
      setIsSavingScan(false);
    }
  };

  const captureCameraSnapshotAndAutoSave = async () => {
    if (videoRef.current) {
      const maxDim = 900;
      let w = videoRef.current.videoWidth || 900;
      let h = videoRef.current.videoHeight || 675;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
      await handleProcessReceiptPhoto(dataUrl);
    }
  };

  const handleReceiptPhotoSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressedDataUrl = await compressReceiptImage(file, 900, 0.65);
        if (compressedDataUrl) {
          await handleProcessReceiptPhoto(compressedDataUrl);
        } else {
          showNotice('Failed to process receipt image file', 'error');
        }
      } catch (err) {
        showNotice('Failed to process image: ' + err.message, 'error');
      }
    }
  };

  // Delete Item (Strictly restricted to Admin accounts only)
  const handleDeleteItem = async (id, name) => {
    if (!isAdmin) {
      showNotice('Access Denied: Only administrators have permission to delete receipts.', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const itemToDelete = items.find(i => i.id === id);
      if (itemToDelete?.sourceTable && itemToDelete.sourceTable !== 'inventory_items') {
        await backend.deleteReceipt(itemToDelete.sourceTable, id);
      }
      await backend.deleteReceipt('inventory_items', id);
      setItems(prev => {
        const next = prev.filter(i => i.id !== id);
        saveCachedItems(next);
        return next;
      });
      showNotice(`Deleted "${name}"`);
      if (viewItem?.id === id) setViewItem(null);
    } catch (err) {
      console.error(err);
      showNotice('Failed to delete item', 'error');
    }
  };

  // Rename Saved Document
  const handleRenameItem = async () => {
    if (!renameItem || !renameNewName.trim()) return;
    const rawNewName = renameNewName.trim();
    setIsRenaming(true);
    try {
      const id = renameItem.id;
      const ext = (renameItem.fileFormat || 'JPG').toLowerCase();
      const finalFileName = rawNewName.includes('.') ? rawNewName : `${rawNewName}.${ext}`;
      const finalTitle = rawNewName.replace(/\.[^/.]+$/, '');

      // 1. Update master inventory_items table in MySQL
      await backend.updateReceipt('inventory_items', id, {
        file_name: finalFileName,
        title: finalTitle,
      });
      const targetTable = renameItem.sourceTable;
      if (targetTable && targetTable !== 'inventory_items') {
        try {
          await backend.updateReceipt(targetTable, id, {
            file_name: finalFileName,
            title: finalTitle,
          });
        } catch (tableErr) {
          console.warn(`Dedicated table rename (${targetTable}):`, tableErr);
        }
      }

      // 3. Update local state and cached items
      setItems(prev => {
        const next = prev.map(i => i.id === id ? { ...i, fileName: finalFileName, title: finalTitle } : i);
        saveCachedItems(next);
        return next;
      });

      // 4. Update Document Viewer modal if viewing this document
      if (viewItem && viewItem.id === id) {
        setViewItem(prev => ({ ...prev, fileName: finalFileName, title: finalTitle }));
      }

      showNotice(`Document renamed to "${finalFileName}"!`);
      setRenameItem(null);
      setRenameNewName('');
    } catch (err) {
      console.error('Failed to rename document:', err);
      showNotice('Failed to rename document: ' + (err.message || err), 'error');
    } finally {
      setIsRenaming(false);
    }
  };

  // Save Upright Photo Orientation for an existing document
  const handleSaveUprightPhoto = async (item, newPhotoUrl) => {
    if (!item?.id || !newPhotoUrl) return;
    try {
      showNotice('Saving upright photo orientation...');
      const id = item.id;
      // 1. Update master inventory_items in MySQL
      await backend.updateReceipt('inventory_items', id, { file_path: newPhotoUrl });
      const targetTable = item.sourceTable || item.tableName;
      if (targetTable && targetTable !== 'inventory_items') {
        try {
          await backend.updateReceipt(targetTable, id, { file_path: newPhotoUrl });
        } catch (tblErr) {
          console.warn('Dedicated table upright update:', tblErr);
        }
      }

      // 3. Update local state and cached items
      setItems(prev => {
        const next = prev.map(i => i.id === id ? { ...i, filePath: newPhotoUrl } : i);
        saveCachedItems(next);
        return next;
      });

      if (viewItem && viewItem.id === id) {
        setViewItem(prev => ({ ...prev, filePath: newPhotoUrl }));
      }

      showNotice('Receipt photo saved upright successfully!');
    } catch (err) {
      console.error('Failed to save upright photo:', err);
      showNotice('Failed to save upright photo: ' + (err.message || err), 'error');
    }
  };


  // ----------------------------------------------------
  // LOGIN / CREATE ADMIN ACCOUNT VIEW (If not logged in)
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <AuthPortalView
        authPortal={authPortal}
        switchAuthPortal={switchAuthPortal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authConfirmPassword={authConfirmPassword}
        setAuthConfirmPassword={setAuthConfirmPassword}
        authFullName={authFullName}
        setAuthFullName={setAuthFullName}
        authAdminEmail={authAdminEmail}
        setAuthAdminEmail={setAuthAdminEmail}
        authAdminPassword={authAdminPassword}
        setAuthAdminPassword={setAuthAdminPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        authLoading={authLoading}
        authError={authError}
        setAuthError={setAuthError}
        handleAuthSubmit={handleAuthSubmit}
        isLight={isLight}
        notification={notification}
        styles={styles}
        isMobile={isMobile}
      />
    );
  }

  return (
    <View style={[styles.container, isLight && styles.containerLight]}>
      {/* Notification Toast */}
      {notification && (
        <View style={[styles.toast, notification.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          {notification.type === 'error' ? <AlertTriangle size={18} color="#fff" /> : <CheckCircle2 size={18} color="#fff" />}
          <Text style={styles.toastText}>{notification.text}</Text>
        </View>
      )}

      <TopHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openAddModal={openAddModal}
        exportFolderToExcel={exportFolderToExcel}
        activeNav={activeNav}
        fetchData={fetchData}
        isSyncing={isSyncing}
        currentUser={currentUser}
        isAdmin={isAdmin}
        isEmployee={isEmployee}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setShowEmployeeModal={setShowEmployeeModal}
        width={width}
        isDesktop={isDesktop}
        isMobile={isMobile}
        isSmallMobile={isSmallMobile}
        isLight={isLight}
        styles={styles}
      />

      {/* MAIN WORKSPACE: LEFT SIDEBAR IS THE SOLE NAVIGATION */}
      <View style={[styles.mainContent, isLight && styles.mainContentLight]}>
        <SidebarDirectory
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDrawerMode={isDrawerMode}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          items={items}
          filteredItems={filteredItems}
          showAllFiles={showAllFiles}
          handleToggleShowAll={handleToggleShowAll}
          openAddModal={openAddModal}
          exportFolderToExcel={exportFolderToExcel}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
          currentUser={currentUser}
          isAdmin={isAdmin}
          isEmployee={isEmployee}
          isKnoahEmployee={isKnoahEmployee}
          isRedGooseEmployee={isRedGooseEmployee}
          isPetcEmployee={isPetcEmployee}
          isConsumablesEmployee={isConsumablesEmployee}
          isSalesIncomeEmployee={isSalesIncomeEmployee}
          isLight={isLight}
          styles={styles}
        />

        {/* MAIN VIEWING AREA */}
        {currentPage === 'admin' && isAdmin ? (
          <AdminPortalPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onBackToInventory={() => setCurrentPage('inventory')}
            employees={employees}
            handleCreateEmployee={handleCreateEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
            empFullName={empFullName}
            setEmpFullName={setEmpFullName}
            empEmail={empEmail}
            setEmpEmail={setEmpEmail}
            empPassword={empPassword}
            setEmpPassword={setEmpPassword}
            empConfirmPassword={empConfirmPassword}
            setEmpConfirmPassword={setEmpConfirmPassword}
            empRole={empRole}
            setEmpRole={setEmpRole}
            empDepartment={empDepartment}
            setEmpDepartment={setEmpDepartment}
            showEmpPassword={showEmpPassword}
            setShowEmpPassword={setShowEmpPassword}
            empLoading={empLoading}
            empError={empError}
            EMPLOYEE_ROLES={EMPLOYEE_ROLES}
            EMPLOYEE_DEPARTMENTS={EMPLOYEE_DEPARTMENTS}
            isLight={isLight}
            isMobile={isMobile}
            styles={styles}
          />
        ) : (
          <View
            accessibilityRole="main"
            style={[styles.contentArea, isLight && styles.contentAreaLight]}
          >

            {/* 4. CLEAN SEARCH & FILTER ACTION BAR */}
            <View style={[styles.controlBar, isMobile && styles.controlBarMobile, isLight && styles.controlBarLight]}>
              <View style={[styles.controlBarLeft, isMobile && { width: '100%', justifyContent: 'space-between', gap: 8 }]}>
                <View style={[styles.breadcrumbs, { flex: 1, minWidth: 0 }]}>
                  <Text style={[styles.breadcrumbItem, isLight && styles.breadcrumbItemLight]}>Records</Text>
                  <ChevronRight size={14} color={isLight ? '#94a3b8' : '#64748b'} />
                  <Text style={[styles.breadcrumbActive, isLight && styles.breadcrumbActiveLight]} numberOfLines={1}>{activeNav.label}</Text>
                </View>

                {(activeNav.type !== 'all' || activeNav.year || activeNav.subCategory || searchQuery) && (
                  <TouchableOpacity
                    style={[styles.clearFilterBtn, isLight && styles.clearFilterBtnLight]}
                    onPress={() => {
                      setActiveNav({ type: 'all', year: null, month: null, subCategory: null, label: 'All Inventory Files' });
                      setSearchQuery('');
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Reset active category filter and search"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={12} color={isLight ? '#ef4444' : '#f87171'} />
                    <Text style={[styles.clearFilterBtnText, isLight && styles.clearFilterBtnTextLight]}>Reset</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={[styles.controlBarRight, isMobile && { width: '100%', flexDirection: 'column', gap: 8, alignItems: 'stretch' }]}>
                {/* Search input for screens < 960px where it is not in the top header */}
                {width < 960 && (
                  <View style={[styles.searchBox, { width: '100%' }, isLight && styles.searchBoxLight]}>
                    <Search size={15} color={isLight ? '#64748b' : '#94a3b8'} />
                    <TextInput
                      style={[styles.searchInput, isLight && styles.searchInputLight]}
                      placeholder="Search store, invoice #, amount..."
                      placeholderTextColor={isLight ? '#94a3b8' : '#64748b'}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      accessibilityLabel="Search inventory by store name, invoice number, or amount"
                      autoComplete="off"
                      autoCorrect={false}
                      spellCheck={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        accessibilityRole="button"
                        accessibilityLabel="Clear mobile search query"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <X size={14} color={isLight ? '#64748b' : '#94a3b8'} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: isMobile ? 'space-between' : 'flex-end', width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' }}>
                  {/* Export Excel Button - only visible when navigated into a sub-folder */}
                  {(activeNav.year || activeNav.month || activeNav.subCategory) && (
                    <TouchableOpacity
                      style={[styles.exportExcelBtn, isLight && styles.exportExcelBtnLight]}
                      onPress={() => exportFolderToExcel(activeNav)}
                      title={`Export "${activeNav.label}" into formal Excel spreadsheet`}
                    >
                      <FileSpreadsheet size={13} color={isLight ? '#059669' : '#34d399'} />
                      <Text style={[styles.exportExcelBtnText, isLight && styles.exportExcelBtnTextLight]}>
                        Export Excel
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Total Count Pill */}
                  <View style={[styles.countBadge, isLight && styles.countBadgeLight]}>
                    <Text style={[styles.countBadgeText, isLight && styles.countBadgeTextLight]}>
                      {filteredItems.length} {filteredItems.length === 1 ? 'record' : 'records'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ITEM DISPLAY */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f47721" />
                <Text style={styles.loadingText}>Loading inventory records</Text>
              </View>
            ) : isSalesOrIncomeView ? (
              <SalesIncomeCalendarView
                mode={isSalesView ? 'sales' : 'income'}
                filteredItems={filteredItems}
                onSaveDailyEntry={handleSaveDailySalesIncome}
                onDeleteItem={handleDeleteItem}
                onExportExcel={() => exportFolderToExcel(activeNav)}
                isAdmin={isAdmin}
                isPetcEmployee={isPetcEmployee}
                isKnoahEmployee={isKnoahEmployee}
                isRedGooseEmployee={isRedGooseEmployee}
                isLight={isLight}
                activeNav={activeNav}
                styles={styles}
              />
            ) : filteredItems.length === 0 ? (
              activeNav.type === 'all' && !showAllFiles ? (
                <View style={styles.emptyContainer}>
                  <EyeOff size={48} color="#64748b" />
                  <Text style={styles.emptyTitle}>All Files Display is Hidden</Text>
                  <Text style={styles.emptySubtitle}>
                    You have toggled off displaying all {items.length} files. You can turn it back on anytime using the toggle button, or select a specific category folder from the sidebar.
                  </Text>
                  <TouchableOpacity
                    style={styles.btnToggleEmptyOn}
                    onPress={handleToggleShowAll}
                  >
                    <Eye size={15} color="#252525" />
                    <Text style={styles.btnToggleEmptyOnText}>Show All Files ({items.length})</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  {isAnyConsumables ? (
                    <Package size={44} color="#f47721" />
                  ) : (
                    <Layers size={44} color={isLight ? '#cbd5e1' : '#334155'} />
                  )}
                  <Text style={[styles.emptyTitle, isLight && styles.emptyTitleLight]}>
                    {searchQuery
                      ? 'No items match your search'
                      : isPetcOfficeSupplies
                        ? 'No office supplies recorded for PETC'
                        : isStoreConsumables
                          ? `No store consumables recorded in ${activeNav.label?.replace('Consumables > ', '') || 'Store'}`
                          : isAnyConsumables
                            ? 'No supplies or consumables recorded yet'
                            : items.length === 0
                              ? 'No files or documents currently in system'
                              : `No records found in ${activeNav.label}`}
                  </Text>
                  <Text style={[styles.emptySubtitle, isLight && styles.emptySubtitleLight]}>
                    {searchQuery
                      ? 'Try searching with a different item name or keyword.'
                      : isPetcOfficeSupplies
                        ? 'There are currently no office supplies recorded for PETC. Tap "Add Office Supplies" to record your first item.'
                        : isStoreConsumables
                          ? 'There are currently no store consumables recorded for this establishment. Tap "Add Consumable" to record your first consumable item.'
                          : isAnyConsumables
                            ? 'There are currently no supplies recorded. Tap "Add Supplies" to record your first item.'
                            : items.length === 0
                              ? 'Your inventory database is currently empty. Tap "Scan Receipt" to add your first record.'
                              : 'You can tap "Scan Receipt" to add a new document, or choose another category from the tabs above.'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {searchQuery ? (
                      <TouchableOpacity
                        style={[styles.heroExportBtn, isLight && styles.heroExportBtnLight]}
                        onPress={() => setSearchQuery('')}
                      >
                        <X size={15} color={isLight ? '#f47721' : '#f47721'} />
                        <Text style={[styles.heroExportBtnText, isLight && styles.heroExportBtnTextLight]}>Clear Search</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={styles.heroScanBtn}
                      onPress={openAddModal}
                    >
                      {isAnyConsumables ? (
                        <Package size={15} color="#ffffff" />
                      ) : (
                        <Camera size={15} color="#ffffff" />
                      )}
                      <Text style={styles.heroScanBtnText}>
                        {isPetcOfficeSupplies
                          ? 'Add Office Supplies'
                          : isStoreConsumables
                            ? 'Add Store Consumable'
                            : isAnyConsumables
                              ? 'Add Supplies'
                              : 'Scan New Receipt'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ) : isAnyConsumables ? (
              <ConsumablesTableView
                filteredItems={filteredItems}
                onViewItem={(item) => setViewItem(item)}
                onEditItem={(item) => openAddModal(item)}
                onDeleteItem={handleDeleteItem}
                onAddConsumable={() => openAddModal()}
                onExportExcel={() => exportFolderToExcel(activeNav)}
                isAdmin={isAdmin}
                isLight={isLight}
                activeNav={activeNav}
                styles={styles}
              />
            ) : useCardsView ? (
              <DocumentCardsView
                filteredItems={filteredItems}
                onViewItem={(item) => setViewItem(item)}
                onRenameItem={(item) => {
                  setRenameItem(item);
                  setRenameNewName(item?.fileName || '');
                }}
                onDeleteItem={handleDeleteItem}
                isAdmin={isAdmin}
                isLight={isLight}
                activeNav={activeNav}
                styles={styles}
              />
            ) : (
              <DocumentTableView
                filteredItems={filteredItems}
                onViewItem={(item) => setViewItem(item)}
                onRenameItem={(item) => {
                  setRenameItem(item);
                  setRenameNewName(item?.fileName || '');
                }}
                onDeleteItem={handleDeleteItem}
                isAdmin={isAdmin}
                isLight={isLight}
                activeNav={activeNav}
                styles={styles}
              />
            )}
          </View>
        )}
      </View>

      {/* EMPLOYEE STAFF PROFILE & LOGOUT MODAL */}
      <EmployeeSessionModal
        visible={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isLight={isLight}
        styles={styles}
        isMobile={isMobile}
      />

      {/* ======================================================== */}
      {/* 1. DOCUMENT VIEWER MODAL                                 */}
      {/* ======================================================== */}
      <DocumentViewerModal
        viewItem={viewItem}
        onClose={() => setViewItem(null)}
        onRename={(item) => {
          setRenameItem(item);
          setRenameNewName(item?.fileName || '');
        }}
        onSaveUprightPhoto={handleSaveUprightPhoto}
        isLight={isLight}
        isMobile={isMobile}
        styles={styles}
      />

      {/* ======================================================== */}
      {/* 2. ADD DOCUMENT MODAL: TWO OPTIONS ONLY                  */}
      {/* (Insert Document OR Scan Document)                       */}
      {/* ======================================================== */}
      <AddDocumentModal
        showAddModal={showAddModal}
        addMode={addMode}
        setAddMode={setAddMode}
        closeAddModal={closeAddModal}
        stopCamera={stopCamera}
        startCamera={startCamera}
        flipCamera={flipCamera}
        cameraActive={cameraActive}
        videoRef={videoRef}
        insertedFile={insertedFile}
        setInsertedFile={setInsertedFile}
        isUploading={isUploading}
        handleDeviceFileSelect={handleDeviceFileSelect}
        handleSaveInsertedFile={handleSaveInsertedFile}
        selectedReceiptType={selectedReceiptType}
        setSelectedReceiptType={setSelectedReceiptType}
        capturedReceiptPhoto={capturedReceiptPhoto}
        setCapturedReceiptPhoto={setCapturedReceiptPhoto}
        isSavingScan={isSavingScan}
        isOcrProcessing={isOcrProcessing}
        ocrStatusText={ocrStatusText}
        ocrProgress={ocrProgress}
        ocrEstablishment={ocrEstablishment}
        setOcrEstablishment={setOcrEstablishment}
        ocrReceiptDate={ocrReceiptDate}
        setOcrReceiptDate={setOcrReceiptDate}
        ocrDescription={ocrDescription}
        setOcrDescription={setOcrDescription}
        ocrAmount={ocrAmount}
        setOcrAmount={setOcrAmount}
        ocrOrNumber={ocrOrNumber}
        setOcrOrNumber={setOcrOrNumber}
        isOcrVerifiedView={isOcrVerifiedView}
        setIsOcrVerifiedView={setIsOcrVerifiedView}
        ocrValidationError={ocrValidationError}
        setOcrValidationError={setOcrValidationError}
        ocrReceiptName={ocrReceiptName}
        setOcrReceiptName={setOcrReceiptName}
        ocrLineItems={ocrLineItems}
        setOcrLineItems={setOcrLineItems}
        saveVerifiedReceiptToDatabase={saveVerifiedReceiptToDatabase}
        captureCameraSnapshotAndAutoSave={captureCameraSnapshotAndAutoSave}
        handleReceiptPhotoSelect={handleReceiptPhotoSelect}
        isAdmin={isAdmin}
        isKnoahEmployee={isKnoahEmployee}
        isRedGooseEmployee={isRedGooseEmployee}
        isPetcEmployee={isPetcEmployee}
        isConsumablesEmployee={isConsumablesEmployee}
        isSalesIncomeEmployee={isSalesIncomeEmployee}
        currentUser={currentUser}
        activeNav={activeNav}
        handleProcessReceiptPhoto={handleProcessReceiptPhoto}
        consumableEntity={consumableEntity}
        setConsumableEntity={setConsumableEntity}
        allItems={items}
        consumableName={consumableName}
        setConsumableName={setConsumableName}
        consumableQty={consumableQty}
        setConsumableQty={setConsumableQty}
        consumableUnit={consumableUnit}
        setConsumableUnit={setConsumableUnit}
        consumableAmount={consumableAmount}
        setConsumableAmount={setConsumableAmount}
        consumableDate={consumableDate}
        setConsumableDate={setConsumableDate}
        consumableNotes={consumableNotes}
        setConsumableNotes={setConsumableNotes}
        consumableStatus={consumableStatus}
        setConsumableStatus={setConsumableStatus}
        consumableSupplier={consumableSupplier}
        setConsumableSupplier={setConsumableSupplier}
        consumableOrSiNo={consumableOrSiNo}
        setConsumableOrSiNo={setConsumableOrSiNo}
        consumableUnitCost={consumableUnitCost}
        setConsumableUnitCost={setConsumableUnitCost}
        consumableItemNo={consumableItemNo}
        setConsumableItemNo={setConsumableItemNo}
        editingConsumableId={editingConsumableId}
        isSavingConsumable={isSavingConsumable}
        handleSaveStoreConsumable={handleSaveStoreConsumable}
        isLight={isLight}
        isMobile={isMobile}
        styles={styles}
      />

      {/* ======================================================== */}
      {/* 3. RENAME DOCUMENT MODAL                                  */}
      {/* ======================================================== */}
      <RenameDocumentModal
        renameItem={renameItem}
        renameNewName={renameNewName}
        setRenameNewName={setRenameNewName}
        isRenaming={isRenaming}
        onSave={handleRenameItem}
        onClose={() => {
          setRenameItem(null);
          setRenameNewName('');
        }}
        isLight={isLight}
        isMobile={isMobile}
        styles={styles}
      />

      {/* MOBILE FLOATING ACTION BUTTON */}
      {isMobile && (
        <View style={styles.mobileFloatingBar}>
          <TouchableOpacity
            style={styles.mobileFloatingBtn}
            onPress={() => openAddModal()}
            activeOpacity={0.85}
            title={
              isPetcOfficeSupplies
                ? "Add office supplies"
                : isStoreConsumables
                  ? "Add store consumable"
                  : isAnyConsumables
                    ? "Add supplies"
                    : "Scan receipt with camera"
            }
          >
            {isAnyConsumables ? (
              <Package size={20} color="#ffffff" />
            ) : (
              <Camera size={20} color="#ffffff" />
            )}
            <Text style={styles.mobileFloatingBtnText}>
              {isPetcOfficeSupplies
                ? 'Add Office Supplies'
                : isStoreConsumables
                  ? 'Add Consumables'
                  : isAnyConsumables
                    ? 'Add Supplies'
                    : 'Scan Receipt'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// STYLES
// STYLES
// STYLES
// STYLES
