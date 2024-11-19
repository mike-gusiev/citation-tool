const allowedIPsForPing = [
    "144.76.154.130",
    "144.76.153.113",
    "144.76.153.106",
    "94.130.155.89",
    "178.63.193.217",
    "94.130.93.29",
  ];
  
  
 const checkAllowedIPsForPing = (req, res, next) => {
    const clientIP = req.ip.replace("::ffff:", "");
    console.log(`Incoming request from IP: ${clientIP}`);
  
    if (allowedIPsForPing.includes(clientIP)) {
      return next();
    }
  
    console.warn(`Unauthorized access attempt from IP: ${clientIP}`);
    res.status(403).json({ message: "Access forbidden: unauthorized IP address" });
  };

  module.exports = checkAllowedIPsForPing;