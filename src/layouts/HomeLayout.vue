<template>
    <div>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/auth/login">Login</router-link> |
        <router-link to="/auth/register">Register</router-link> |
        <router-link to="/admin/dashboard">Dashboard</router-link> |
    </div>
    <div>
        <router-view></router-view>
    </div>
</template>