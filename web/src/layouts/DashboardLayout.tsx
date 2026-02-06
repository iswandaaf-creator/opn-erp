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
    Security as SecurityIcon
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
        // SUPER ADMIN / OWNER ONLY - "God Mode" Dashboard
        {
            text: t('common.platformAdmin') || 'Platform Admin',
            icon: <BusinessIcon />,
            path: '/super-admin',
            roles: ['SUPER_ADMIN', 'OWNER']
        },

        // MANAGER & OPS - Standard Dashboard
        {
            text: t('common.dashboard'),
            icon: <DashboardIcon />,
            path: '/admin',
            roles: ['MANAGER', 'ADMIN', 'FINANCE', 'SALES', 'PPIC', 'PURCHASING', 'WAREHOUSE', 'QUALITY_CONTROL']
        },

        // REST OF THE MENUS...
        { text: t('common.pos') || 'POS / Sales', icon: <ShoppingCart />, path: '/pos', roles: ['OWNER', 'MANAGER', 'CASHIER'] },
        {
            text: t('common.salesDistribution') || 'Sales & Distribution',
            icon: <ShoppingCart />,
            path: '/sales',
            roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'SALES', 'SALES_ADMIN', 'WAREHOUSE'],
            children: [
                { text: t('common.quotations') || 'Quotations', path: '/sales/quotations' },
                { text: t('common.orders'), path: '/sales/orders' },
                { text: t('common.invoices') || 'Invoices', path: '/sales/invoices' },
                { text: t('common.delivery') || 'Delivery', path: '/sales/delivery' },
            ]
        },
        {
            text: t('common.inventoryProcurement') || 'Inventory & Procurement',
            icon: <InventoryIcon />,
            roles: ['OWNER', 'MANAGER', 'INVENTORY', 'WAREHOUSE', 'PURCHASING', 'PPIC', 'QUALITY_CONTROL'],
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
            roles: ['OWNER', 'MANAGER', 'PRODUCTION', 'PPIC'],
            children: [
                { text: t('common.bom') || 'Bill of Materials', path: '/manufacturing/bom' },
                { text: t('common.workOrders') || 'Work Orders', path: '/manufacturing/orders' },
            ]
        },
        {
            text: t('common.crm') || 'CRM',
            icon: <PeopleIcon />,
            path: '/crm',
            roles: ['OWNER', 'MANAGER', 'SALES', 'SALES_ADMIN']
        },
        {
            text: t('common.financeAccounting') || 'Finance & Accounting',
            icon: <AssignmentIcon />,
            roles: ['OWNER', 'MANAGER', 'FINANCE', 'ACCOUNTANT'],
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
            roles: ['OWNER', 'MANAGER', 'HR_ADMIN']
        },

        // SUPER ADMIN / OWNER ONLY - User Management
        {
            text: t('common.users') || 'Users',
            icon: <SecurityIcon />,
            path: '/users',
            roles: ['SUPER_ADMIN', 'OWNER']
        },

        {
            text: t('settings.title'),
            icon: <SettingsIcon />,
            path: '/settings',
            roles: ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION', 'EMPLOYEE', 'USER', 'CASHIER', 'SALES', 'ACCOUNTANT']
        }
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(role));

    const renderMenuItem = (item: any) => {
        if (item.children) {
            const isOpen = openSubmenus[item.text];
            return (
                <div key={item.text}>
                    <ListItemButton onClick={() => handleSubmenuToggle(item.text)} sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}>
                        <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child: any) => (
                                <ListItemButton
                                    key={child.text}
                                    sx={{ pl: 4, borderRadius: 1, mx: 1, mb: 0.5 }}
                                    selected={location.pathname === child.path}
                                    onClick={() => {
                                        navigate(child.path);
                                        if (isMobile) setMobileOpen(false);
                                    }}
                                >
                                    <ListItemText primary={child.text} />
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
                        mx: 1,
                        mb: 0.5,
                    }}
                >
                    <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
            </ListItem>
        );
    };

    const drawerContent = (
        <Box>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, height: 80 }}>
                <img src="/logo.svg" alt="Open Erp." style={{ height: 40, width: 'auto' }} />
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
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    mt: 8
                }}
            >
                <Outlet />
            </Box>
            <CommandPalette />
        </Box>
    );
};
