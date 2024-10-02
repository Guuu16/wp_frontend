export function useLogin() {
    const store = useStore()
    const router = useRouter()
    const form = reactive({
        username: '',
        password: '',
    })
    const formRef = ref(null)
    const loading = ref(false)
    const rules = reactive({
        username: [
            { required: true, message: 'Please input Activity username', trigger: 'blur' },
        ],
        password: [
            { required: true, message: 'Please input Activity password', trigger: 'blur' },
        ],
    })

    const onSubmit = () => {
        const unFormRef = unref(formRef)
        unFormRef.validate(valid => {
            if (!valid) {
                return false
            }
            loading.value = true
            store.dispatch("login", form).then(res => {
                router.push("/")
            }).finally(() => {
                loading.value = false
            })
        })
    }

    return {
        form,
        formRef,
        loading,
        rules,
        onSubmit
    }
}

export function useLogout() {
    const store = useStore()
    const router = useRouter()
    function handleLogout() {
        showModal("Are you sure you want to log out?").then(res => {
            logout().finally(() => {
                store.dispatch("logout")
                store.state.hasGetInfo = false
                router.push("/login")
            })
        })
    }
    return {
        handleLogout
    }
}

export function useRePassword() {
    const store = useStore()
    const router = useRouter()
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const form = reactive({
        oldpassword: '',
        password: '',
        repassword: '',
    })

    const rules = reactive({
        oldpassword: [
            {
                required: true,
                message: 'The old password cannot be empty',
                trigger: 'blur'
            },
        ],
        password: [
            {
                required: true,
                message: 'The new password cannot be empty',
                trigger: 'blur'
            },
        ],
        repassword: [
            {
                required: true,
                message: 'Confirm password cannot be empty',
                trigger: 'blur'
            },
        ],
    })


    const onSubmit = () => {
        const unFormRef = unref(formRef)
        unFormRef.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading()
            updatePassword(form).then(res => {
                logout().finally(() => {
                    store.dispatch("logout")
                    toAsk("Password modified successfully, Please login again")
                    router.push("/login")
                })
            }).finally(() => {
                formDrawerRef.value.hideLoading()
            })
        })
    }

    const openRePasswordForm = () => formDrawerRef.value.open()

    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        onSubmit,
        openRePasswordForm
    }
}