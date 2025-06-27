<template>
  <nav class="nav">
    <ul class="nav__menu">
      <!-- <li class="nav__menu-item"><a>Home</a></li> -->
      <li class="nav__menu-item"><a>Services</a>
        <ul class="nav__submenu">
          <li class="nav__submenu-item"> <a>Web Design</a></li>
          <li class="nav__submenu-item"> <a>Web Development</a></li>
          <li class="nav__submenu-item"> <a>Web Hosting</a></li>
        </ul>
      </li>
      <li class="nav__menu-item"><a>About</a>
        <ul class="nav__submenu">
          <li class="nav__submenu-item"> <a>Our Company</a></li>
          <li class="nav__submenu-item"> <a>Our Team</a></li>
          <li class="nav__submenu-item"> <a>Our Reach</a></li>
        </ul>
      </li>
    </ul>
    </nav>
</template>
<script setup lang="ts">
// import { defineComponent, ref } from "vue";




</script>
<style lang="scss" scoped>
// html {
//   box-sizing: border-box;
// }

// *, *:before, *:after {
//   box-sizing: border-box;
// }

// body {
//   margin: 0;
//   font-family: "Open Sans", sans-serif;
//   font-size: 16px;
//   line-height: 1.5;
//   background: rgb(39, 174, 96);
// }

nav {
  width: 100%;
  height: 45px;
  position: relative;
  background: rgb(30, 132, 73);
  color: rgb(240, 240, 240);
}

nav ul {
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
}

h1 {
  width: 500px;
  margin: 100px auto 20px;
  color: rgb(240, 240, 240);
  text-align: center;
}

.nav {
  width: 100%;
  margin: 0 auto;
  background: rgb(30, 132, 73);
  color: rgb(240, 240, 240);
}
.nav a {
  display: block;
  padding: 0 16px;
  line-height: inherit;
  cursor: pointer;
}
.nav__menu {
  line-height: 45px;
  font-weight: 700;
  text-transform: uppercase;
}
.nav__menu-item {
  display: inline-block;
  position: relative;
}
.nav__menu-item:hover {
  background-color: rgb(155, 89, 182);
}
.nav__menu-item:hover .nav__submenu {
  display: block;
}
.nav__submenu {
  font-weight: 300;
  text-transform: none;
  display: none;
  position: absolute;
  width: 220px;
  background-color: rgb(155, 89, 182);
}
.nav__submenu-item:hover {
  background: rgba(0, 0, 0, 0.1);
}

</style>
<!-- https://freefrontend.com/css-code-examples/ -->
<!-- https://codepen.io/jurbank/pen/DqByKy -->
<!-- https://codepen.io/mikerojas87/pen/xxvJPp -->
