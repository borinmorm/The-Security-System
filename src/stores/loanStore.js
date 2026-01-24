import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'

export const useLoanStore = defineStore('loan', () => {
  const { getItem, setItem } = useLocalStorage()

  // Initialize state from localStorage or use defaults
  const initialLoans = [
    { id: 1, borrower: 'John Doe', amount: 50000, interestRate: 5.5, status: 'Active' },
    { id: 2, borrower: 'Jane Smith', amount: 75000, interestRate: 6.0, status: 'Active' },
    { id: 3, borrower: 'Bob Johnson', amount: 30000, interestRate: 5.0, status: 'Pending' },
  ]

  const initialApplications = [
    {
      id: 1,
      applicantName: 'Alice Brown',
      email: 'alice@example.com',
      requestedAmount: 40000,
      status: 'Pending',
    },
    {
      id: 2,
      applicantName: 'Charlie Wilson',
      email: 'charlie@example.com',
      requestedAmount: 60000,
      status: 'Approved',
    },
  ]

  const initialBorrowers = [
    {
      id: 1,
      name: 'Maria Santos Cruz',
      email: 'maria.santos@example.com',
      phone: '09812345671',
      creditScore: 0,
    },
    {
      id: 2,
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@example.com',
      phone: '09823456782',
      creditScore: 0,
    },
    {
      id: 3,
      name: 'Rosa Garcia Fernandez',
      email: 'rosa.garcia@example.com',
      phone: '09834567893',
      creditScore: 0,
    },
    {
      id: 4,
      name: 'Carlos Reyes Lopez',
      email: 'carlos.reyes@example.com',
      phone: '09845678904',
      creditScore: 0,
    },
    {
      id: 5,
      name: 'Angela Perez Morales',
      email: 'angela.perez@example.com',
      phone: '09856789015',
      creditScore: 0,
    },
    {
      id: 6,
      name: 'Miguel Torres Gonzales',
      email: 'miguel.torres@example.com',
      phone: '09867890126',
      creditScore: 0,
    },
    {
      id: 7,
      name: 'Sofia Chavez Ramirez',
      email: 'sofia.chavez@example.com',
      phone: '09878901237',
      creditScore: 0,
    },
    {
      id: 8,
      name: 'Luis Salazar Medina',
      email: 'luis.salazar@example.com',
      phone: '09889012348',
      creditScore: 0,
    },
    {
      id: 9,
      name: 'Patricia Navarro Flores',
      email: 'patricia.navarro@example.com',
      phone: '09890123459',
      creditScore: 0,
    },
    {
      id: 10,
      name: 'Enrique Dominguez Castro',
      email: 'enrique.dominguez@example.com',
      phone: '09801234560',
      creditScore: 0,
    },
  ]

  const loans = ref(getItem('loans', initialLoans))
  const applications = ref(getItem('applications', initialApplications))
  const borrowers = ref(getItem('borrowers', initialBorrowers))

  let loanCounter = Math.max(...loans.value.map((l) => l.id), 0) + 1
  let appCounter = Math.max(...applications.value.map((a) => a.id), 0) + 1
  let borrowerCounter = Math.max(...borrowers.value.map((b) => b.id), 0) + 1

  // Watch for changes and persist to localStorage
  watch(loans, (newLoans) => setItem('loans', newLoans), { deep: true })
  watch(applications, (newApps) => setItem('applications', newApps), { deep: true })
  watch(borrowers, (newBorrowers) => setItem('borrowers', newBorrowers), { deep: true })

  const addLoan = (loan) => {
    loans.value.push({
      id: loanCounter++,
      ...loan,
    })
  }

  const deleteLoan = (id) => {
    loans.value = loans.value.filter((l) => l.id !== id)
  }

  const addApplication = (app) => {
    applications.value.push({
      id: appCounter++,
      ...app,
    })
  }

  const deleteApplication = (id) => {
    applications.value = applications.value.filter((a) => a.id !== id)
  }

  const addBorrower = (borrower) => {
    borrowers.value.push({
      id: borrowerCounter++,
      ...borrower,
    })
  }

  const deleteBorrower = (id) => {
    borrowers.value = borrowers.value.filter((b) => b.id !== id)
  }

  const updateBorrower = (id, updates) => {
    const borrower = borrowers.value.find((b) => b.id === id)
    if (borrower) {
      Object.assign(borrower, updates)
    }
  }

  return {
    loans,
    applications,
    borrowers,
    addLoan,
    deleteLoan,
    addApplication,
    deleteApplication,
    addBorrower,
    deleteBorrower,
    updateBorrower,
  }
})
