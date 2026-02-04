import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem, useTheme, useMediaQuery, CssBaseline, Collapse
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
    Search as SearchIcon
} from '@mui/icons-material';
import { CommandPalette } from '../components/CommandPalette';

const drawerWidth = 240;

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        { text: 'Platform Admin', icon: <BusinessIcon />, path: '/super-admin', roles: ['SUPER_ADMIN'] },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin', roles: ['OWNER', 'MANAGER', 'ADMIN'] },
        { text: 'POS / Sales', icon: <ShoppingCart />, path: '/pos', roles: ['OWNER', 'MANAGER'] },
        {
            text: 'Inventory & Procurement',
            icon: <InventoryIcon />,
            roles: ['OWNER', 'MANAGER', 'INVENTORY'],
            children: [
                { text: 'Dashboard', path: '/inventory/dashboard' },
                { text: 'Stock Items', path: '/inventory' },
                { text: 'Material Requests', path: '/inventory/material-requests' },
                { text: 'Goods Receipts', path: '/inventory/goods-receipts' },
                { text: 'Stock Ledger', path: '/inventory/stock-ledger' },
                { text: 'Suppliers', path: '/buying/suppliers' },
                { text: 'Purchase Orders', path: '/buying/orders' },
            ]
        },
        {
            text: 'Manufacturing',
            icon: <FactoryIcon />,
            roles: ['OWNER', 'PRODUCTION'],
            children: [
                { text: 'Work Orders', path: '/work-orders' },
                { text: 'Bill of Materials', path: '/bom' },
            ]
        },
        { text: 'CRM / Leads', icon: <PeopleIcon />, path: '/crm', roles: ['OWNER', 'MANAGER'] },
        { text: 'Employees', icon: <PeopleIcon />, path: '/employees', roles: ['OWNER', 'HR_ADMIN'] },
        { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['OWNER', 'HR_ADMIN'] },
        { text: 'Accounting', icon: <AssignmentIcon />, path: '/accounting', roles: ['OWNER', 'MANAGER'] },
        { text: 'Approvals', icon: <AssignmentIcon />, path: '/manager', roles: ['OWNER', 'MANAGER'] },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['OWNER', 'MANAGER', 'HR_ADMIN', 'INVENTORY', 'PRODUCTION'] },
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
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                <Typography variant="h6" noWrap component="div" color="primary" fontWeight="bold">
                    ACG Infotech
                </Typography>
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
                    <IconButton color="inherit" sx={{ mr: 2 }}>
                        <NotificationsIcon />
                    </IconButton>

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
