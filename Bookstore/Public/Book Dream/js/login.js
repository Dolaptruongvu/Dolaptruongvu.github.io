const btnSignUpElm = document.querySelector(".btn-login");

btnSignUpElm.addEventListener("click", async () => {
  const emailELm = document.getElementById("email");
  const passwordElm = document.getElementById("password");

  if (!emailELm.value || !passwordElm.value) {
    alert("Vui lòng nhập đầy đủ các trường thông tin!");
    return;
  }
  try {
    const { data } = await axios.post("/api/v1/customer/login", {
      email: emailELm.value,
      password: passwordElm.value,
    });

    alert("Đăng nhập thành công");
    window.location.href = "/";
  } catch (error) {
    alert(error.response.data.message);
    console.log(error);
  }
});
