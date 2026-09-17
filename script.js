// ==========================================
// 1. DATABASE CONFIGURATION
// ==========================================
// Replace these placeholders with your actual Supabase credentials
const SUPABASE_URL = "https://hxysisxphqptlhbnxnhg.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_0HPM6gPyu-YfugIbbEbtzw_CBDlj9Dw";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. MODEL CLASS (Encapsulation Architecture)
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
        // Fetch data from cloud automatically when system boots
        this.fetchFromCloud();
    }

    // [READ] Pulls live rows from the database table
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

    // [CREATE] Inserts a new row into the database table
    async addTutor(name, subject, rate) {
        const { error } = await supabase
            .from('tutors')
            .insert([{ name: name, subject: subject, rate: rate }]);

        if (error) {
            alert('Database insertion failed: ' + error.message);
        } else {
            this.fetchFromCloud(); // Refresh the list
        }
    }

    // [DELETE] Removes a row from the database table matching the ID
    async removeTutor(id) {
        const { error } = await supabase
            .from('tutors')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Database extraction failed: ' + error.message);
        } else {
            this.fetchFromCloud(); // Refresh the list
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
                <h3>ðŸ‘¤ ${tutor.name}</h3>
                <p><strong>Focus:</strong> ${tutor.subject}</p>
                <p class="rate">â‚±${tutor.rate}/hr</p>
                <button class="delete-btn" onclick="systemInstance.removeTutor('${tutor.id}')">Delete</button>
            `;
            grid.appendChild(card);
        });
    }
}

// Instantiate Global System Controller Instance
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
        alert('Please fill out all layout entries completely.');
        return;
    }

    systemInstance.addTutor(
        nameInput.value,
        subjectInput.value,
        parseFloat(rateInput.value)
    );

    // Clear user entry configurations for next record
    nameInput.value = '';
    subjectInput.value = '';
    rateInput.value = '';
});
