// ==============================================================================
// KartHAS - Autenticación y Control de Acceso (admin / admin)
// ==============================================================================

const Auth = {
    sessionKey: 'karthas_admin_auth',

    init() {
        this.updateUI();
    },

    isAdmin() {
        return localStorage.getItem(this.sessionKey) === 'authenticated';
    },

    login(username, password) {
        const user = (username || '').trim().toLowerCase();
        const pass = (password || '').trim();

        if (user === 'admin' && pass === 'admin') {
            localStorage.setItem(this.sessionKey, 'authenticated');
            this.updateUI();
            return { success: true };
        }
        return { success: false, message: 'Usuario o contraseña incorrectos. Usa admin / admin' };
    },

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.updateUI();
    },

    updateUI() {
        const isAdmin = this.isAdmin();
        document.querySelectorAll('.admin-only').forEach(el => {
            if (isAdmin) {
                el.classList.remove('hidden-admin');
            } else {
                el.classList.add('hidden-admin');
            }
        });

        const authBtn = document.getElementById('authNavBtn');
        const userBadge = document.getElementById('adminBadge');
        if (authBtn) {
            if (isAdmin) {
                authBtn.innerHTML = `<span class="icon">🔓</span> Cerrar Sesión`;
                authBtn.classList.add('btn-admin-active');
            } else {
                authBtn.innerHTML = `<span class="icon">🔐</span> Admin`;
                authBtn.classList.remove('btn-admin-active');
            }
        }

        if (userBadge) {
            userBadge.style.display = isAdmin ? 'inline-flex' : 'none';
        }
    }
};

window.Auth = Auth;
