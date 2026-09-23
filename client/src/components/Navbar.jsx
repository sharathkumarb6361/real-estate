import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Heart, LogOut, LayoutDashboard, Bell, Check, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    notificationAPI.getNotifications()
      .then(response => {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      })
      .catch(() => toast.error('Failed to load notifications'));
  }, [user]);

  const markNotificationRead = async (notification) => {
    if (notification.isRead) return;
    try {
      await notificationAPI.markNotificationAsRead(notification._id);
      setNotifications(previous => previous.map(item => item._id === notification._id ? { ...item, isRead: true } : item));
      setUnreadCount(count => Math.max(0, count - 1));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationAPI.markAsRead();
      setNotifications(previous => previous.map(notification => ({ ...notification, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const removeNotification = async (id) => {
    try {
      const removed = notifications.find(notification => notification._id === id);
      await notificationAPI.deleteNotification(id);
      setNotifications(previous => previous.filter(notification => notification._id !== id));
      if (removed && !removed.isRead) setUnreadCount(count => Math.max(0, count - 1));
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="EstateHub Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-800">EstateHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">Properties</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>

            {user ? (
              <>
                <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 transition flex items-center">
                  <Heart className="h-5 w-5 mr-1" />
                  Wishlist
                </Link>
                <Link to={user.role === 'AGENT' ? '/agent/dashboard' : '/dashboard'} className="text-gray-700 hover:text-blue-600 transition flex items-center">
                  <LayoutDashboard className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <div className="relative">
                  <button onClick={() => setShowNotifications(previous => !previous)} className="relative text-gray-700 hover:text-blue-600" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                  </button>
                  {showNotifications && <div className="absolute right-0 top-8 z-50 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold text-gray-900">Notifications</h3><button onClick={markAllNotificationsRead} className="text-xs text-blue-600">Mark all read</button></div>
                    <div className="max-h-80 space-y-2 overflow-y-auto">{notifications.length === 0 ? <p className="py-6 text-center text-sm text-gray-500">No notifications</p> : notifications.map(notification => <div key={notification._id} className={`rounded p-2 text-sm ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}><button onClick={() => markNotificationRead(notification)} className="w-full text-left"><p className="font-medium text-gray-900">{notification.title}</p><p className="text-gray-600">{notification.message}</p></button><div className="mt-1 flex justify-end gap-2"><button onClick={() => markNotificationRead(notification)} title="Mark as read" className="text-gray-500"><Check className="h-4 w-4" /></button><button onClick={() => removeNotification(notification._id)} title="Delete notification" className="text-red-500"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
                  </div>}
                </div>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                    Admin
                  </Link>
                )}
                {user.role === 'AGENT' && (
                  <Link to="/agent/dashboard" className="text-gray-700 hover:text-blue-600 transition">Agent</Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Hello, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition flex items-center"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
            <Link to="/properties" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Properties</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">About</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Contact</Link>
            {user ? (
              <>
                <Link to="/wishlist" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Wishlist</Link>
                <Link to={user.role === 'AGENT' ? '/agent/dashboard' : '/dashboard'} className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                <button onClick={() => setShowNotifications(previous => !previous)} className="flex w-full items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100"><Bell className="mr-2 h-5 w-5" />Notifications {unreadCount > 0 && `(${unreadCount})`}</button>
                {showNotifications && <div className="mx-3 max-h-64 overflow-y-auto rounded border p-2">{notifications.map(notification => <button key={notification._id} onClick={() => markNotificationRead(notification)} className="block w-full border-b p-2 text-left text-sm last:border-0"><span className="font-medium">{notification.title}</span><br /><span className="text-gray-500">{notification.message}</span></button>)}</div>}
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Admin</Link>
                )}
                {user.role === 'AGENT' && (
                  <Link to="/agent/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Agent</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
