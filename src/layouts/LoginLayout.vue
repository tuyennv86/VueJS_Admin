<template>
    <div class="bg-gradient-primary min-vh-100 d-flex align-items-center justify-content-center">
        <div class="container">
            <div class="row justify-content-center">

                <div class="col-xl-10 col-lg-12 col-md-9">
                    <div class="card o-hidden border-0 shadow-lg my-5">
                        <div class="card-body p-0">
                            <router-view></router-view>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/css/sb-admin-2.css";

</script>

<style scoped>
.bg-login-image {
    background: url("@/assets/img/login-bg.jpg");
    background-position: center;
    background-size: cover;
}
</style>