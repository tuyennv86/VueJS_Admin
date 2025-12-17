<template>
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ isEdit ? "Cập nhật người dùng" : "Thêm người dùng" }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form @submit.prevent="saveUser">
                    <div class="modal-body">

                        <!-- FULL NAME -->
                        <div class="mb-3">
                            <label class="form-label">Họ và tên</label>
                            <input v-model="form.fullName" type="text" class="form-control" required />
                        </div>

                        <!-- EMAIL -->
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input v-model="form.email" type="email" class="form-control" required />
                        </div>

                        <!-- USERNAME -->
                        <div class="mb-3">
                            <label class="form-label">Username</label>
                            <input v-model="form.username" type="text" class="form-control" required />
                        </div>

                        <!-- PASSWORD -->
                        <div class="mb-3" v-if="!isEdit">
                            <label class="form-label">Mật khẩu</label>
                            <input v-model="form.password" type="password" class="form-control" required />
                        </div>

                        <!-- ẢNH -->
                        <div class="mb-4">
                            <label class="form-label">Ảnh đại diện</label>

                            <div class="mt-2">
                                <!-- ẢNH PREVIEW -->
                                <img v-if="previewImage" :src="previewImage"
                                    class="w-32 h-32 object-cover rounded border" style="max-width: 200px;" />

                                <!-- ẢNH CŨ -->
                                <img v-else-if="form.imageUrl" :src="apiUrl + 'uploads/' + form.imageUrl"
                                    class="w-32 h-32 object-cover rounded border" style="max-width: 200px;" />

                                <p v-else class="text-muted fst-italic">Chưa có ảnh</p>
                            </div>

                            <input type="file" class="mt-3" @change="onFileChange" />
                        </div>

                        <!-- ROLES -->
                        <div class="mb-3">
                            <label class="form-label">Vai trò</label>
                            <select v-model="form.roleIds" multiple class="form-select" required>
                                <option v-for="role in roles" :key="role.id" :value="role.id">
                                    {{ role.name }}
                                </option>
                            </select>
                            <small class="text-muted">Giữ Ctrl để chọn nhiều thành phần</small>
                        </div>

                        <!-- ACTIVE -->
                        <div class="form-check">
                            <input v-model="form.isActive" type="checkbox" class="form-check-input" id="isActive" />
                            <label for="isActive" class="form-check-label">Kích hoạt</label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            {{ isEdit ? "Lưu thay đổi" : "Thêm mới" }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted } from "vue";
import * as bootstrap from "bootstrap";

const props = defineProps({
    user: Object,
    roles: Array
});

const emits = defineEmits(["save"]);

const apiUrl = import.meta.env.VITE_API_URL;

// ẢNH
const previewImage = ref(null);
const imageFile = ref(null);

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
};

// FORM
const form = reactive({
    id: null,
    fullName: "",
    email: "",
    username: "",
    password: "",
    isActive: true,
    roleIds: [],
    imageUrl: ""
});

const resetForm = () => {
    Object.assign(form, {
        id: null,
        fullName: "",
        email: "",
        username: "",
        password: "",
        isActive: true,
        roleIds: [],
        imageUrl: ""
    });
    previewImage.value = null;
    imageFile.value = null;
};

// Load data khi mở modal
watch(() => props.user,
    (u) => {
        if (u) {
            Object.assign(form, {
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                username: u.username,
                password: "",
                isActive: u.isActive,
                roleIds: u.roles ? u.roles.map((r) => r.id) : [],
                imageUrl: u.imageUrl
            });
        } else {
            resetForm();
        }

        previewImage.value = null;
        imageFile.value = null;
    },
    { immediate: true }
);

const isEdit = computed(() => !!props.user);

// MODAL
const modalRef = ref(null);
let bsModal = null;

onMounted(() => {
    bsModal = new bootstrap.Modal(modalRef.value);
});

const open = () => bsModal.show();
const close = () => bsModal.hide();

// Lưu người dùng
const saveUser = () => {
    emits("save", {
        form: { ...form },
        imageFile: imageFile.value,
        isEdit: isEdit.value
    });

    close();
    resetForm();
};

defineExpose({ open, close });
</script>
