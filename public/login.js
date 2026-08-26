const username = document.querySelector("#username");
const password = document.querySelector("#password");
const btn = document.querySelector("#button");
const message = document.querySelector("#message");

btn.addEventListener("click", async (e) => {
  e.preventDefault(); 

  try {
    const res = await fetch("/api/login", { 
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json(); 

    if (res.status === 401) {
      message.innerText = "Wrong credentials";
    } else if (res.ok) { 
    
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      window.location.href = "/dashboard/panel";
    } else {
      message.innerText = data.message || "Something went wrong";
    }
  } catch (err) {
    console.log(err)
    message.innerText = "wrong credentials";
  }
});