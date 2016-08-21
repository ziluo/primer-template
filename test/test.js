var compile = require('../');

console.log(compile('I am <%=name%>, and i like playing <%=man.game%>.'));

console.log(compile('I am <%=(name, "fadfadf")%><%if(man){%> and i like playing <%=man.game%><%}%>.'));

console.log(compile('I am <%=name%><%if(man){%> and i like playing <%=man.game%><%}%>.'));

console.log(compile([
  'I am <%=name%><%if(man){%> and I like playing <%=man.game%><%}%>.',
  'My favorite animates are ',
  '<% animates.each(function(animate){ %>',
  '<% if (animate.type !== invisibleType ){ %>',
  '<%=animate.name%>, ',
  '<% } %>',
  '<% }); %>',
  'etc.',
].join('\n')));

// console.log(compile('I am <%=name%><%if(man){%> and i like playing <%=man.game%><%}%>.<%include("./include.atpl")%>', ''));




