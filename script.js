    
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { 
        getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        sendEmailVerification, signOut, onAuthStateChanged 
    } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    import { 
        getFirestore, doc, setDoc, getDoc 
    } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    // FIXME: Replace with your actual Firebase Project Configuration Object
    const firebaseConfig = {
  apiKey: "AIzaSyAODsM04fG95nIniGu1uhXzNukEnNL_OMM",
  authDomain: "rwein-store.firebaseapp.com",
  databaseURL: "https://rwein-store-default-rtdb.firebaseio.com",
  projectId: "rwein-store",
  storageBucket: "rwein-store.firebasestorage.app",
  messagingSenderId: "1047274378784",
  appId: "1:1047274378784:web:1c62876508ee439016ce45",
  measurementId: "G-9MNQYQSB0J"
};


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Global auth handlers attached to window context
    window.handleRegister = async function(e) {
        e.preventDefault();
        const msgDiv = document.getElementById('authMsg');
        msgDiv.style.color = '#333';
        msgDiv.innerText = "Creating account...";

        const name = document.getElementById('regName').value;
        const phone = document.getElementById('regPhone').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            // 1. Create user with Email & Password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Send Verification Email
            await sendEmailVerification(user);

            // 3. Save profile metadata (Name, Phone) into Firestore NoSQL DB
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                phone: phone,
                email: email,
                createdAt: new Date()
            });

            msgDiv.style.color = 'green';
            msgDiv.innerText = "Account created! Verification link sent to your email. Please verify before signing in.";
            document.getElementById('registerForm').reset();
        } catch (error) {
            msgDiv.style.color = 'red';
            msgDiv.innerText = error.message;
        }
    };

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyAODsM04fG95nIniGu1uhXzNukEnNL_OMM",
    authDomain: "rwein-store.firebaseapp.com",
    projectId: "rwein-store",
    storageBucket: "rwein-store.firebasestorage.app",
    messagingSenderId: "1047274378784",
    appId: "1:1047274378784:web:1c62876508ee439016ce45",
    measurementId: "G-9MNQYQSB0J"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Enforce Email Verification Check
            if (!user.emailVerified) {
                msgDiv.style.color = 'red';
                msgDiv.innerText = "Your email is not verified yet. Please check your inbox for the verification link.";
                await signOut(auth);
                return;
            }

            msgDiv.style.color = 'green';
            msgDiv.innerText = "Login successful!";
            setTimeout(closeAuthModal, 1000);
        } catch (error) {
            msgDiv.style.color = 'red';
            msgDiv.innerText = "Invalid credentials or account does not exist.";
        }
    };

    window.logoutUser = function() {
        signOut(auth).then(() => {
            document.getElementById('custName').value = '';
            document.getElementById('custPhone').value = '';
            document.getElementById('custEmail').value = '';
        });
    };

    // Monitor Auth State in Real-Time
    onAuthStateChanged(auth, async (user) => {
        const loginBtn = document.getElementById('loginBtn');
        const userDisplay = document.getElementById('userDisplay');
        const userNameSpan = document.getElementById('userNameSpan');

        if (user && user.emailVerified) {
            // Fetch User Details from Firestore DB
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                userNameSpan.innerText = `Hi, ${userData.name}`;
                
                // Auto-fill checkout form details
                document.getElementById('custName').value = userData.name || '';
                document.getElementById('custPhone').value = userData.phone || '';
                document.getElementById('custEmail').value = userData.email || '';
            }
            loginBtn.style.display = 'none';
            userDisplay.style.display = 'flex';
        } else {
            loginBtn.style.display = 'block';
            userDisplay.style.display = 'none';
        }
    });


    const WHATSAPP_NUMBER = "966530725809";
    const DELIVERY_CHARGE = 25;
    let cart = [];

    const products = [
        { id: 1, code: "P-101", name: "Pure Cotton Fabric Bra", price: 110, discount: 0, category: "Woman", image: "rwein10.jpg" },
        { id: 2, code: "P-102", name: "Wide Strap Goddy", price: 99, discount: 0, category: "Woman", image: "rwein11.jpg" }
    ];

    function renderProducts(items) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = items.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-code">Code: ${product.code}</div>
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price} BDT</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `).join('');
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        cart.push(product);
        document.getElementById('cartBadge').innerText = cart.length;
        updateCartUI();
    }

    function updateCartUI() {
        const container = document.getElementById('cartItemsContainer');
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty.</p>';
            return;
        }
        container.innerHTML = cart.map(item => `
            <div style="border-bottom:1px solid #eee; padding:10px 0;">
                <div><strong>${item.name}</strong></div>
                <div>${item.price} BDT</div>
            </div>
        `).join('');
    }

    function toggleCart() {
        document.getElementById('cartModal').classList.toggle('open');
    }

    function openAuthModal(tab) {
        document.getElementById('authModal').classList.add('open');
        switchAuthTab(tab);
    }

    function closeAuthModal() {
        document.getElementById('authModal').classList.remove('open');
        document.getElementById('authMsg').innerText = '';
    }

    function switchAuthTab(tab) {
        const loginForm = document.getElementById('loginForm');
        const regForm = document.getElementById('registerForm');
        const tabLogin = document.getElementById('tabLogin');
        const tabRegister = document.getElementById('tabRegister');

        if (tab === 'login') {
            loginForm.style.display = 'block';
            regForm.style.display = 'none';
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            regForm.style.display = 'block';
            tabLogin.classList.remove('active');
            tabRegister.classList.add('active');
        }
    }

    function sendOrder(e) {
        e.preventDefault();
        const name = document.getElementById('custName').value;
        const phone = document.getElementById('custPhone').value;
        const email = document.getElementById('custEmail').value;
        const address = document.getElementById('custAddress').value;

        let message = `*NEW ORDER RECEIVED*\n\n*Customer Details:*\n• Name: ${name}\n• Phone: ${phone}\n• Email: ${email}\n• Address: ${address}\n\n`;
        message += `*Items Order Quantity:* ${cart.length}`;

        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`, '_blank');
    }

    renderProducts(products);

