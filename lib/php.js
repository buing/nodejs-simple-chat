exports.htmlspecialchars = function(str){
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};