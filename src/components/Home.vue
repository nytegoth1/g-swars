<template>
  <div id="app">
    <h1><button @click="changePage(currentPage = 1)">Home</button> User list
          <!-- Search Input -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search by name"
      class="search-input"
    />
    <div v-if="loading">Loading...</div>
    <img class="mainlogo" src="/images/Star-Wars-Logo.png" alt="Star Wars logo" />
    </h1>  

    <!-- Display message when no results are found -->
    <div v-if="filteredUsers.length === 0 && searchQuery">
      <p>No results found for "{{ searchQuery }}". Showing 0 results.</p>
    </div>

    <!-- Display filtered user list -->
    <div v-if="filteredUsers.length > 0">
      <div class="s-user card" v-for="user in filteredUsers" :key="user.id">
      <!-- Flip Card Container -->
      <router-link :to="'/user/' + user.id">
      <div class="flip-card">
        <div class="flip-card-inner">
          <!-- Front Side -->
          <div class="flip-card-front">
            <!-- <h2>{{ user.name }}</h2> -->
            <img :src="user.image" alt="User image" />
          </div>
          <!-- Back Side (can be used to show extra info) -->
          <div class="flip-card-back capped">
            <span v-if="user.factionlogo && user.jedilogo"><img :src="user.jedilogo" alt="faction image" class="no-depth" /></span>
            <span v-if="user.factionlogo && !user.jedilogo"><img :src="user.factionlogo" alt="faction image" class="no-depth" /></span>
            <!-- <span v-if="user.jedilogo"><img :src="user.jedilogo" alt="User image" class="no-depth" /></span> -->
            <h2>{{ user.name }}</h2>
            <p>Species: {{ user.species }}</p>
            <p v-if="user.gender">Gender: {{ user.gender }}</p>
          </div>
        </div>
      </div>
    </router-link>
    </div>

    <!-- Show number of filtered results -->
    <div v-if="filteredUsers.length > 0 && searchQuery">
      <p>{{ filteredUsers.length }} result(s) found.</p>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        Previous
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      allUsers: [], // Full dataset of users
      users: [], // Original list of users
      searchQuery: '', // Search query entered by the user
      currentPage: 1,
      totalPages: 1,
      loading: false,
      limit: 12, // Number of items per page (default for pagination)
    };
  },
  computed: {
    // Filtered users based on the search query
    filteredUsers() {
      if (!this.searchQuery) {
        // If there's no search query, return users as per pagination
        return this.users;
      }
      // Return all users if there is a search query (ignores pagination)
      return this.users.filter(user =>
      user.name.replace(/-/g, '').toLowerCase().startsWith(this.searchQuery.toLowerCase()) // Remove hyphen and check if the name starts with searchQuery
      );
    },
  },
  methods: {
    // Fetch users data from the backend API with pagination or all results based on search
    async fetchUsers(page = 1) {
      this.loading = true;
      localStorage.setItem("current-page", page);
      
      // If there's a search query, ignore pagination limit (set a larger limit to fetch all users)
      const currentLimit = this.searchQuery ? 200 : this.limit;

      try {
        const response = await axios.get('http://localhost:3076/api/users', {
          params: {
            page: this.searchQuery ? 1 : page, // Set page 1 when searching to get all matching users
            limit: currentLimit, // Adjust limit based on search
          },
        });

        // If there's a search, we want to update allUsers with the filtered data, not just this.users
        if (this.searchQuery) {
          this.users = response.data.users; // All matching users
        } else {
          this.users = response.data.users; // Regular paginated users
        }

        //console.log('Users:', this.users);
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    },

    // Change the page number and fetch the new data
    changePage(page) {
      if (page > 0 && page <= this.totalPages && !this.searchQuery) {
        this.fetchUsers(page);
        //console.log('Page:', page);
      }
    },
  },
  watch: {
    searchQuery(newQuery) {
      // When the search query changes, fetch all results ignoring pagination
      if (newQuery) {
        this.fetchUsers(1); // Always start from page 1 when searching
      } else {
        this.fetchUsers(this.currentPage); // Restore pagination if no search
      }
    },
  },
  mounted() {
    // Check localStorage for the saved page and restore it
    const savedPage = localStorage.getItem('current-page');
    const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1;
    this.fetchUsers(pageToLoad); // Fetch data for the saved or default page
  },
};

</script>

<style scoped>
#app {
  margin: 0 auto;
  padding: 20px;
  display: block;
}

h3 {
  margin: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

button:disabled {
  opacity: 0.5;
}

img {
  height: 240px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(13, 20, 26, 0.4), 0 4px 6px -4px rgba(13, 24, 32, 0.4);
}

.s-user {
  margin: 12px;
  display: inline-grid;
}

.card {
  align-items: center;
  justify-content: space-around;
  width: 260px;
  padding: 20px 1px;
  text-align: center;
  position: relative;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(13, 20, 26, 0.4), 0 4px 6px -4px rgba(13, 24, 32, 0.4);
  border-radius: 12px;
  background-color: #fff;
}

/* Styling for the search input */
.search-input {
  width: 100%;
  max-width: 300px;
  margin: 20px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.flip-card {
  width: 300px;
  height: 400px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  padding-bottom: 22px;
}

.flip-card-front {
  overflow: hidden;
}

.flip-card-front img {
  max-height: 100%;
}

.flip-card-back {
  background-color: #555;
  color: white;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Flip Card Styles */
.flip-card {
  width: 240px;
  height: 240px;
  perspective: 1000px;
  margin: 20px auto;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-front img {
  height: 100%;
  border-radius: 12px;
  cursor: pointer;
}

.flip-card-back {
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: black;
  transform: rotateY(180deg);
  cursor: pointer;
}

.flip-card-back h2 {
  margin: 0;
}

.flip-card-back p {
  font-size: 1rem;
  margin: 5px 0;
}

.no-depth {
    height: 70px;
    padding: 6px;
    box-shadow: none;
}

button {
  padding: 10px 15px;
  margin: 0 5px;
  font-size: 16px;
  cursor: pointer;
  background-color: black;
  color: white;
  border-radius: 5px;
  outline: none;
}

.capped {
  text-transform: capitalize;
}

.mainlogo {
  height: 88px;
  float: inline-start;
  margin-right: 28px;
  box-shadow: none;
}
</style>
