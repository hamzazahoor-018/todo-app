$(document).ready(function(){

  $('form').on('submit', function(){

      var item = $('form input');
      var todo = {item: item.val()};

      $.ajax({
        type: 'POST',
        url: '/todo',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });

  $(document).on('click', 'li', function(){
      var itemId = $(this).data('id');
      var itemText = $(this).data('item');
      var deleteTarget = itemId || itemText;
      $.ajax({
        type: 'DELETE',
        url: '/todo/' + encodeURIComponent(deleteTarget),
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});
