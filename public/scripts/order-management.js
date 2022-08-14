const updateOrderFormElements = document.querySelectorAll('.order-actions form');  

  async function updateOrder(event) {
    event.preventDefault();  //stop the form submission with prevent default
    const form = event.target;  //acess to the form
  
    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('_csrf');
  
    let response;
  
    try {
      response = await fetch(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          newStatus: newStatus,  //new order status that I want to set
          _csrf: csrfToken,
        }),
        headers: {
          'Content-Type': 'application/json',  //on the backend, this incoming request can be parsed successfully.
        },
      });
    } catch (error) {
      alert('Something went wrong - could not update order status.');
      return;
    }
  
    if (!response.ok) {
      alert('Something went wrong - could not update order status.');
      return;
    }
  
    const responseData = await response.json();
  
    form.parentElement.parentElement.querySelector('.badge').textContent =
      responseData.newStatus.toUpperCase();
  }
  
  for (const updateOrderFormElement of updateOrderFormElements) {
    updateOrderFormElement.addEventListener('submit', updateOrder);
  }