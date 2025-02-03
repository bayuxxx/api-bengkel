// middleware/roleCheck.js
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Authentication required' });
        }
  
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ 
            error: 'Access forbidden',
            message: `This action requires one of these roles: ${allowedRoles.join(', ')}`
          });
        }
  
        next();
      } catch (error) {
        return res.status(500).json({ error: 'Role check failed' });
      }
    };
  };
  
  // Specific role check middlewares
  const isSuperAdmin = checkRole(['SUPER_ADMIN']);
  const isAdmin = checkRole(['SUPER_ADMIN', 'CASHIER']);
  const isStaff = checkRole(['SUPER_ADMIN', 'CASHIER', 'EMPLOYE']);
  
  module.exports = {
    checkRole,
    isSuperAdmin,
    isAdmin,
    isStaff
  };