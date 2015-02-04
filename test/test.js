var compile = require('../');

console.log(compile('I am <%=name%>, and i like playing <%=man.game%>.'));

console.log(compile('I am <%=name%><%if(man){%> and i like playing <%=man.game%><%}%>.'))


