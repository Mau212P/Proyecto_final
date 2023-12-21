<!-- src/components/AppNavbar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">LentiTlax</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <router-link to="/" class="nav-link">Inicio</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/categorias" class="nav-link">Categorías</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/carrito" class="nav-link">Carrito</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar'
}
</script>
