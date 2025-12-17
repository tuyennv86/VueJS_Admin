<template>
    <div class="row">
        <!-- Hình nền -->
        <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>

        <!-- Form -->
        <div class="col-lg-6">
            <div class="p-5">
                <div class="text-center mb-4">
                    <h1 class="h4 text-gray-900">Welcome Back!</h1>
                </div>

                <form class="user" @submit.prevent="handleLogin">
                    <div class="form-group">
                        <input v-model="credentials.username" type="text" class="form-control form-control-user"
                            placeholder="Enter Username..." required />
                    </div>
                    <div class="form-group">
                        <input v-model="credentials.password" type="password" class="form-control form-control-user"
                            placeholder="Password" required />
                    </div>

                    <div class="form-group">
                        <div class="custom-control custom-checkbox small">
                            <input type="checkbox" class="custom-control-input" id="rememberMe" v-model="rememberMe" />
                            <label class="custom-control-label" for="rememberMe">Remember
                                Me</label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-user btn-block">
                        Login
                    </button>

                    <hr />

                    <button type="button" class="btn btn-google btn-user btn-block">
                        <i class="fab fa-google fa-fw"></i> Login with Google
                    </button>
                    <button type="button" class="btn btn-facebook btn-user btn-block">
                        <i class="fab fa-facebook-f fa-fw"></i> Login with Facebook
                    </button>
                </form>

                <hr />
                <div class="text-center">
                    <router-link to="/auth/forgot" class="small">Forgot Password?</router-link>
                </div>
                <div class="text-center">
                    <router-link to="/auth/register" class="small">Create an Account!</router-link>
                </div>
            </div>
        </div>
        <!-- End Form -->
    </div>
</template>

<script setup>
import { ref, Text } from 'vue';
import { useAuthStore } from '@/stores/auth';

const credentials = ref({
    username: '',
    password: '',
});

const authStore = useAuthStore();

const handleLogin = async () => {
    try {
        await authStore.login(credentials.value);
    } catch (error) {
        alert('Login failed. Please check your credentials.' + error);
    }
};
</script>