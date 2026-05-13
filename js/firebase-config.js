// Firebase Configuration — MICH PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyBbnU8DkthpYQMHOLLyj6M0cc05qXfjMcw",
  authDomain: "ramadan-2385b.firebaseapp.com",
  databaseURL: "https://ramadan-2385b-default-rtdb.firebaseio.com",
  projectId: "ramadan-2385b",
  storageBucket: "ramadan-2385b.firebasestorage.app",
  messagingSenderId: "882828936310",
  appId: "1:882828936310:web:7f97b921031fe130fe4b57"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Realtime ref shortcuts
const projectsRef = db.ref('mich/projects');
const ordersRef = db.ref('mich/orders');
const chatRef = db.ref('mich/chat');
const visitorsRef = db.ref('mich/visitors');
const postersRef = db.ref('mich/posters');
