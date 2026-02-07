import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem, useTheme, useMediaQuery, CssBaseline, Collapse,
    Tooltip, Select, FormControl
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Assignment as AssignmentIcon,
    People as PeopleIcon,
    Factory as FactoryIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    Notifications as NotificationsIcon,
    ShoppingCart,
    ExpandLess,
    ExpandMore,
    Business as BusinessIcon,
    Search as SearchIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Language as LanguageIcon,
    Security as SecurityIcon,
    Chat as ChatIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { CommandPalette } from '../components/CommandPalette';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';
import NotificationBell from '../components/NotificationBell';

const drawerWidth = 240;

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
    const { mode, toggleTheme } = useThemeMode();
    const { language, setLanguage } = useLanguage();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSubmenuToggle = (text: string) => {
        setOpenSubmenus(prev => ({ ...prev, [text]: !prev[text] }));
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role || 'GUEST';

    const allMenuItems = [
        // ===== MAIN DASHBOARDS =====
        {
            text: t('common.platformAdmin') || 'Platform Admin',
            icon: <BusinessIcon />,
            path: '/super-admin',
            roles: ['SUPER_ADMIN', 'OWNER'],
            category: 'main'
        },
        {
            text: t('common.dashboard'),
            icon: <DashboardIcon />,
            path: '/admin',
            roles: ['ADMIN', 'MANAGER', 'FINANCE', 'SALES', 'PPIC', 'PURCHASING', 'WAREHOUSE', 'QUALITY_CONTROL'],
            category: 'main'
        },

        // ===== OPERATIONS (Sales, POS, CRM) =====
        {
            text: t('common.pos') || 'Point of Sale',
            icon: <ShoppingCart />,
            path: '/pos',
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'],
            category: 'operations'
        },
        {
            text: t('common.salesDistribution') || 'Sales',
            icon: <ShoppingCart />,
            roles: ['SUPER_ADMIN', 'OWNER', 'ADMIN', 'MANAGER', 'SALES', 'SALES_ADMIN', 'WAREHOUSE'],
            category: 'operations',
            children: [
                { text: t('common.quotations') || 'Quotations', path: '/sales/quotations' },
                { text: t('common.orders'), path: '/sales/orders' },
                { text: t('common.invoices') || 'Invoices', path: '/sales/invoices' },
                { text: t('common.delivery') || 'Delivery', path: '/sales/delivery' },
            ]
        },
        {
            text: t('common.crm') || 'CRM',
            icon: <PeopleIcon />,
            path: '/crm',
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'SALES', 'SALES_ADMIN'],
            category: 'operations'
        },

        // ===== SUPPLY CHAIN (Inventory, Purchasing, Manufacturing) =====
        {
            text: t('common.inventoryProcurement') || 'Inventory',
            icon: <InventoryIcon />,
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'INVENTORY', 'WAREHOUSE', 'PURCHASING', 'PPIC', 'QUALITY_CONTROL'],
            category: 'supply_chain',
            children: [
                { text: t('common.dashboard'), path: '/inventory/warehouse' },
                { text: t('common.stockItems') || 'Stock Items', path: '/inventory' },
                { text: t('common.materialRequests') || 'Material Requests', path: '/inventory/material-requests' },
                { text: t('common.goodsReceipts') || 'Goods Receipts', path: '/inventory/goods-receipts' },
                { text: t('common.stockLedger') || 'Stock Ledger', path: '/inventory/stock-ledger' },
                { text: t('common.suppliers') || 'Suppliers', path: '/buying/suppliers' },
                { text: t('common.purchaseOrders') || 'Purchase Orders', path: '/buying/purchase-orders' },
            ]
        },
        {
            text: t('common.manufacturing') || 'Manufacturing',
            icon: <FactoryIcon />,
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'PRODUCTION', 'PPIC'],
            category: 'supply_chain',
            children: [
                { text: t('common.bom') || 'Bill of Materials', path: '/manufacturing/bom' },
                { text: t('common.workOrders') || 'Work Orders', path: '/manufacturing/orders' },
            ]
        },

        // ===== BACK OFFICE (Finance, HR) =====
        {
            text: t('common.financeAccounting') || 'Finance',
            icon: <AssignmentIcon />,
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'FINANCE', 'ACCOUNTANT'],
            category: 'back_office',
            children: [
                { text: t('common.dashboard'), path: '/accounting' },
                { text: t('common.journal') || 'Journal Entries', path: '/accounting/journal' },
                { text: t('common.salesInvoices') || 'Sales Invoices', path: '/sales/invoices' },
                { text: t('common.payments') || 'Payments', path: '/sales/payments' },
            ]
        },
        {
            text: t('common.hr') || 'HR & Employees',
            icon: <PeopleIcon />,
            path: '/hr',
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'HR_ADMIN'],
            category: 'back_office'
        },

        // ===== COMMUNICATION =====
        {
            text: t('common.chat') || 'Chat',
            icon: <ChatIcon />,
            path: '/chat',
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'KITCHEN', 'STAFF', 'FINANCE', 'WAREHOUSE'],
            category: 'communication'
        },
        {
            text: t('common.email') || 'Email',
            icon: <EmailIcon />,
            path: '/email',
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'FINANCE', 'WAREHOUSE'],
            category: 'communication'
        },

        // ===== ADMINISTRATION =====
        {
            text: t('common.users') || 'User Management',
            icon: <SecurityIcon />,
            path: '/users',
            roles: ['SUPER_ADMIN', 'OWNER'],
            category: 'admin'
        },
        {
            text: t('settings.title') || 'Settings',
            icon: <SettingsIcon />,
            path: '/settings',
            roles: ['SUPER_ADMIN', 'OWNER', 'ADMIN', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION', 'EMPLOYEE', 'USER', 'CASHIER', 'SALES', 'ACCOUNTANT'],
            category: 'admin'
        }
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(role));

    const renderMenuItem = (item: any) => {
        if (item.children) {
            const isOpen = openSubmenus[item.text];
            return (
                <div key={item.text}>
                    <ListItemButton
                        onClick={() => handleSubmenuToggle(item.text)}
                        sx={{
                            borderRadius: 1,
                            mx: { xs: 1.5, md: 1 },
                            mb: 0.5,
                            py: { xs: 1.5, md: 1 }, // Larger touch target on mobile
                            minHeight: { xs: 48, md: 'auto' } // Google Material guidelines
                        }}
                    >
                        <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ fontSize: { xs: '1rem', md: '0.875rem' } }} // Larger text on mobile
                        />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child: any) => (
                                <ListItemButton
                                    key={child.text}
                                    created-by="antigravity"
                                    sx={{
                                        pl: 4,
                                        borderRadius: 1,
                                        mx: { xs: 1.5, md: 1 },
                                        mb: 0.5,
                                        py: { xs: 1.5, md: 0.5 }, // Consistent touch target
                                        minHeight: { xs: 48, md: 'auto' }
                                    }}
                                    selected={location.pathname === child.path}
                                    onClick={() => {
                                        navigate(child.path);
                                        if (isMobile) setMobileOpen(false);
                                    }}
                                >
                                    <ListItemText
                                        primary={child.text}
                                        primaryTypographyProps={{ fontSize: { xs: '0.95rem', md: '0.875rem' } }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </div>
            );
        }

        return (
            <ListItem key={item.text} disablePadding>
                <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                        navigate(item.path);
                        if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                        '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                            '&:hover': { bgcolor: 'primary.main' },
                        },
                        borderRadius: 1,
                        mx: { xs: 1.5, md: 1 },
                        mb: 0.5,
                        py: { xs: 1.5, md: 1 }, // Larger touch target
                        minHeight: { xs: 48, md: 'auto' }
                    }}
                >
                    <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: { xs: '1rem', md: '0.875rem' } }}
                    />
                </ListItemButton>
            </ListItem>
        );
    };

    const drawerContent = (
        <Box>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, height: { xs: 64, md: 80 } }}>
                <Box component="img" src="/logo.svg" alt="Open Erp." sx={{ height: { xs: 32, md: 40 }, width: 'auto', maxHeight: 40 }} />
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map(renderMenuItem)}
            </List>
            <Divider sx={{ my: 1 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ mx: 1, borderRadius: 1 }}>
                        <ListItemIcon>
                            <LogoutIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" sx={{ color: 'error.main' }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>

                    <IconButton color="inherit" sx={{ mr: 1 }} onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
                        <SearchIcon />
                    </IconButton>

                    {/* Language Selector */}
                    <FormControl size="small" sx={{ mr: 1, minWidth: 60 }}>
                        <Select
                            value={language}
                            onChange={(e) => {
                                setLanguage(e.target.value);
                                i18n.changeLanguage(e.target.value);
                            }}
                            variant="standard"
                            sx={{
                                color: 'text.primary',
                                '&:before': { borderBottom: 'none' },
                                '&:after': { borderBottom: 'none' },
                                '& .MuiSelect-select': { py: 0.5 }
                            }}
                        >
                            {LANGUAGES.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                    {lang.code.toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Dark Mode Toggle */}
                    <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                        <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>

                    <NotificationBell />

                    <IconButton
                        size="large"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>AD</Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '4px 0 24px 0 rgba(0,0,0,0.02)'
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 3 }, // Smaller padding on mobile
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    mt: { xs: 7, md: 8 } // Adjust top margin for smaller toolbar
                }}
            >
                <Outlet />
            </Box>
            <CommandPalette />
        </Box>
    );
};
