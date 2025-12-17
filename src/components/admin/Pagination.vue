<template>
    <div v-if="totalPages > 1" class="text-center">
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center my-3">
                <!-- Previous -->
                <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                        <i class="fas fa-angle-double-left"></i>
                    </a>
                </li>

                <!-- Trang đầu -->
                <li v-if="!visiblePagesIncludes(1)" class="page-item" :class="{ active: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(1)">1</a>
                </li>

                <!-- Dấu ... đầu -->
                <li v-if="visiblePages.length && visiblePages[0] > 2" class="page-item disabled">
                    <span class="page-link">…</span>
                </li>

                <!-- Các trang giữa -->
                <li v-for="n in visiblePages" :key="n" class="page-item" :class="{ active: currentPage === n }">
                    <a class="page-link" href="#" @click.prevent="changePage(n)">{{ n }}</a>
                </li>

                <!-- Dấu ... cuối -->
                <li v-if="visiblePages.length && visiblePages[visiblePages.length - 1] < totalPages - 1"
                    class="page-item disabled">
                    <span class="page-link">…</span>
                </li>

                <!-- Trang cuối -->
                <li v-if="!visiblePagesIncludes(totalPages) && totalPages > 1" class="page-item"
                    :class="{ active: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(totalPages)">
                        {{ totalPages }}
                    </a>
                </li>

                <!-- Next -->
                <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                        <i class="fas fa-angle-double-right"></i>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Dòng hiển thị tổng số bản ghi -->
        <div class="text-muted small">
            Hiển thị
            <strong>{{ startRecord }}</strong>–<strong>{{ endRecord }}</strong>
            trên tổng <strong>{{ totalItems }}</strong> bản ghi
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    page: { type: Number, required: true },
    size: { type: Number, required: true }, // số bản ghi mỗi trang
    totalPages: { type: Number, required: true }, // tổng số trang
    totalItems: { type: Number, required: true }, // tổng số bản ghi từ API
});
const emits = defineEmits(["change"]);

const currentPage = computed(() => props.page);

/** Các trang hiển thị giữa */
const visiblePages = computed(() => {
    const total = props.totalPages;
    const current = props.page;
    const delta = 2;

    if (total <= 2) {
        const pages = [];
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }

    let start = Math.max(2, current - delta);
    let end = Math.min(total - 1, current + delta);

    if (current <= delta + 2) end = Math.min(total - 1, 1 + delta * 2);
    if (current >= total - (delta + 1)) start = Math.max(2, total - delta * 2);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
});

/** Kiểm tra visiblePages có chứa trang n không */
const visiblePagesIncludes = (n) => visiblePages.value.includes(n);

/** Chuyển trang — không emit khi click lại trang hiện tại */
const changePage = (newPage) => {
    if (newPage < 1 || newPage > props.totalPages) return;
    if (newPage === props.page) return;
    emits("change", newPage);
};

/** Dòng thống kê */
const startRecord = computed(() => (props.totalItems === 0 ? 0 : (props.page - 1) * props.size + 1));
const endRecord = computed(() => Math.min(props.page * props.size, props.totalItems));
</script>

<style scoped>
.page-item.disabled .page-link {
    pointer-events: none;
    opacity: 0.6;
}

.page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
}

.text-muted {
    margin-top: -0.5rem;
}
</style>