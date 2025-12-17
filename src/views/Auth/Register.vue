<template>
    <div class="row">
        <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
        <div class="col-lg-7">
            <div class="p-5">
                <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                </div>
                <form class="user" @submit.prevent="handleRegister">
                    <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                            <input type="text" class="form-control form-control-user" id="exampleFirstName"
                                placeholder="First Name">
                        </div>
                        <div class="col-sm-6">
                            <input type="text" class="form-control form-control-user" id="exampleLastName"
                                placeholder="Last Name">
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-control form-control-user" id="exampleInputEmail"
                            placeholder="Email Address">
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                            <input type="password" class="form-control form-control-user" id="exampleInputPassword"
                                placeholder="Password">
                        </div>
                        <div class="col-sm-6">
                            <input type="password" class="form-control form-control-user" id="exampleRepeatPassword"
                                placeholder="Repeat Password">
                        </div>
                    </div>
                    <a href="login.html" class="btn btn-primary btn-user btn-block">
                        Register Account
                    </a>
                    <hr>
                    <a href="index.html" class="btn btn-google btn-user btn-block">
                        <i class="fab fa-google fa-fw"></i> Register with Google
                    </a>
                    <a href="index.html" class="btn btn-facebook btn-user btn-block">
                        <i class="fab fa-facebook-f fa-fw"></i> Register with Facebook
                    </a>
                </form>
                <hr>
                <div class="text-center">
                    <router-link to="/auth/forgot" class="small">Forgot Password?</router-link>
                </div>
                <div class="text-center">
                    <router-link to="/auth/login">Already have an account? Login!</router-link>
                </div>
            </div>
        </div>
    </div>
    <!-- <div>
        <h1>Register</h1>
        <form @submit.prevent="handleRegister">
            <input v-model="userData.name" type="text" placeholder="Name" required />
            <input v-model="userData.email" type="email" placeholder="Email" required />
            <input v-model="userData.password" type="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    </div> -->
</template>

<script setup>
import { ref } from 'vue';
import authService from '@/services/auth/auth.service';

const userData = ref({
    name: '',
    email: '',
    password: '',
});

const handleRegister = async () => {
    try {
        await authService.register(userData.value);
        alert('Registration successful! Please login.');
        window.location.href = '/login';
    } catch (error) {
        alert('Registration failed. Please try again.');
    }
};
</script>