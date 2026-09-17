alert("JS File Active!");

// ==========================================
// 1. DATABASE CONFIGURATION
// ==========================================
// Base URL (Removed /rest/v1/)
const SUPABASE_URL = "https://hxysisxphqptlhbnxnhg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eXNpc3hwaHFwdGxoYm54bmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MTM1NDcsImV4cCI6MjEwNTE4OTU0N30.2GovZUPO0HSUxEPuOeDO8D-pvsSCNwWOK8bZxMzBB5k";

// Correct Client Initialization
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 2. MODEL CLASS
// ==========================================
class Tutor {
    constructor(id, name, subject, rate) {
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.rate = rate;
    }
}

// ==========================================
// 3. SERVICE CONTROL LAYER (CRUD Functions)
// ==========================================
class TutoringSystem {
    constructor() {
        this.fetchFromCloud();
    }

    // [READ]
    async fetchFromCloud() {
        const { data, error } = await supabase
            .from('tutors')
            .select('*');

        if (error) {
            console.error('Database connection error:', error);
            return;
        }

        this.updateVisualDisplay(data);
    }

    // [CREATE]
    async addTutor(name, subject, rate) {
        const { error } = await supabase
            .from('tutors')
            .insert([{ name: name, subject: subject, rate: rate }]);

        if (error) {
            alert('Database insertion failed: ' + error.message);
        } else {
            this.fetchFromCloud(); // Refresh list
        }
    }

    // [DELETE]
    async removeTutor(id) {
        const { error } = await supabase
            .from('tutors')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Database extraction failed: ' + error.message);
        } else {
            this.fetchFromCloud(); // Refresh list
        }
    }

    // ==========================================
    // 4. PRESENTATION GENERATOR (UI Updates)
    // ==========================================
    updateVisualDisplay(tutorsList) {
        const grid = document.getElementById('tutorGrid');
        grid.innerHTML = ''; 

        if (!tutorsList || tutorsList.length === 0) {
            grid.innerHTML = '<p style="color: #6b7280; font-style: italic;">No records active in cloud storage.</p>';
            return;
        }

        tutorsList.forEach(tutor => {
            const card = document.createElement('div');
            card.className = 'tutor-card';
            card.innerHTML = `
                <h3>👤 ${tutor.name}</h3>
                <p><strong>Focus:</strong> ${tutor.subject}</p>
                <p class="rate">₱${tutor.rate}/hr</p>
                <button class="delete-btn" onclick="systemInstance.removeTutor('${tutor.id}')">Delete</button>
            `;
            grid.appendChild(card);
        });
    }
}

// Instantiate Global System Controller
const systemInstance = new TutoringSystem();
window.systemInstance = systemInstance;

// ==========================================
// 5. INPUT EVENT BINDINGS
// ==========================================
document.getElementById('addBtn').addEventListener('click', () => {
    const nameInput = document.getElementById('tutorName');
    const subjectInput = document.getElementById('tutorSubject');
    const rateInput = document.getElementById('tutorRate');

    if (!nameInput.value || !subjectInput.value || !rateInput.value) {
        alert('Please fill out all fields completely.');
        return;
    }

    systemInstance.addTutor(
        nameInput.value,
        subjectInput.value,
        parseFloat(rateInput.value)
    );

    nameInput.value = '';
    subjectInput.value = '';
    rateInput.value = '';
});

