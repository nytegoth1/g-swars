<template>
    <div v-if="user" :style="{ backgroundImage: 'url(' + currentBackgroundImage + ')' }" class="user-details">
      
      <div class="user-details full">
        
        <div>
          <h1>{{ user.name }}'s Details
          </h1>
          <!-- <span v-if="user.factionlogo"><img :src="user.factionlogo" alt="User image" class="no-depth" /></span> -->
          <!-- <span v-if="user.roguelogo"><img :src="user.roguelogo" alt="User image" class="no-depth" /></span> -->
          <!-- <span v-if="user.jedilogo"><img :src="user.jedilogo" alt="User image" class="no-depth" /></span> -->
      </div>
      
      <div class="card">

        <img :src="user.image" alt="User image" />


        <h3>{{ user.homeworld }}</h3>
        <ul class="just" v-if="user.gender">
        <li><strong>Gender:</strong> {{ user.gender }}</li>
        <!-- <strong>Born:</strong> {{ user.born }}
        <strong>Born Location:</strong> {{ user.bornLocation }}
        <strong>Died:</strong> {{ user.died }}
        <strong>Died Location:</strong> {{ user.diedLocation }}
        <strong>Hair Color:</strong> {{ user.hairColor }}
        <strong>Eye Color:</strong> {{ user.eyeColor }}
        <strong>Skin Color:</strong> {{ user.skinColor }} -->
        <li v-if="user.cybernetics"><strong>Cybernetics:</strong> {{ user.cybernetics }}</li></ul>

        <div v-if="user.about">
          <h4 class="aff">about:</h4>
          <ul class="about">
            <li v-for="(about, index) in user.about" :key="index">{{ about }}</li>
          </ul>
        </div>

        <div v-if="user.ships">
          <h4 class="aff">Ships:</h4>
          <ul class="just">
            <li v-for="(ship, index) in user.ships" :key="index">{{ ship }}</li>
          </ul>
        </div>
  
        <!-- Affiliation List -->
         <div v-if="user.affiliations">
            <h4 class="aff">Affiliations:</h4>
                <ul class="just">
                    <li v-for="(affiliation, index) in user.affiliations" :key="index">{{ affiliation }}</li>
                </ul>
        </div>

        <div v-if="user.armament">
          <h4 class="aff">Armament:</h4>
          <ul class="just">
            <li v-for="(armament, index) in user.armament" :key="index">{{ armament }}</li>
          </ul>
        </div>

        <div v-if="user.equipment">
          <h4 class="aff">equipment:</h4>
          <ul class="just">
            <li v-for="(equipment, index) in user.equipment" :key="index">{{ equipment }}</li>
          </ul>
        </div>
        
  
        <!-- Masters List -->
        <div v-if="user.masters">
        <h4 class="aff">Masters:</h4>
        <ul>
          <li class="just" v-for="(master, index) in user.masters" :key="index">{{ master }}</li>
        </ul>
        </div>
        <!-- Apprentices List -->
        <div v-if="user.apprentices">
        <h4 class="aff">Apprentices:</h4>
        <ul class="just">
          <li v-for="(apprentice, index) in user.apprentices" :key="index">{{ apprentice }}</li>
        </ul>
        </div>

        <!---
        <span v-if="user.shipimage && user.id !=9"><img :src="user.shipimage" alt="User image" class="shipimage" /></span>

        <span v-if="user.shipimage && user.id ===9"><img :src="user.shipimage" alt="User image" class="shipimagex" /></span>

        <span v-if="user.weaponimage"><img :src="user.weaponimage" alt="User image" class="weaponimage" /></span>

        <span v-if="user.shipimagefett"><img :src="user.shipimagefett" alt="User image" class="shipimagefett" /></span>

        <span v-if="user.shipimageluke"><img :src="user.shipimageluke" alt="User image" class="shipimageluke" /></span>

        <span v-if="user.shipimagedarth"><img :src="user.shipimagedarth" alt="User image" class="shipimagedarth" /></span>
        -->

        <!-- <div class="logos">
          <span v-if="user.factionlogo"><img :src="user.factionlogo" alt="User image" class="no-depth" /></span>
          <span v-if="user.jedilogo"><img :src="user.jedilogo" alt="User image" class="no-depth" /></span>
        </div> -->

      </div>
      <div><router-link to="/">Back to User List</router-link></div>
      </div>
      
    </div>
    <div v-else>
      <p>Loading user details...</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserDetails',
    data() {
      return {
        user: null, // Store the user details here
        currentBackgroundImage: '', // Store the background image URL
        affiliationBackgrounds: {
          // 'Alliance to Restore the Republic': 'https://upsights.fra1.digitaloceanspaces.com/fwbmatch/starwars/star-wars-bg-01.jpg',
          // 'Red Squadron': 'https://images3.alphacoders.com/754/thumb-1920-75475.jpg',
          // 'Rogue Squadron': 'https://images3.alphacoders.com/754/thumb-1920-75475.jpg',
          // 'Massassi Group': 'https://example.com/massassi-group.jpg',
          // 'Leia Organa\'s team': 'https://example.com/leia-team.jpg',
          // 'Endor strike team': 'https://example.com/endor-strike-team.jpg',
          // 'Jedi Order': '../images/jedi_order.jpg',
          // 'Bright Tree tribe': 'https://example.com/bright-tree-tribe.jpg',
          // 'New Republic': 'https://images3.alphacoders.com/754/thumb-1920-75475.jpg',
          // 'Resistance': 'https://upsights.fra1.digitaloceanspaces.com/fwbmatch/starwars/spaceships-bg-04.jpg',
        }
      };
    },
    async created() {
      // Fetch user details using the ID passed in the URL
      const userId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3076/api/users/${userId}`);
        this.user = response.data;
        this.setBackgroundImage();
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    methods: {
      setBackgroundImage() {
        // Check the first affiliation and set the background image accordingly
        const firstAffiliation = this.user.affiliations[0];
        this.currentBackgroundImage = this.affiliationBackgrounds[firstAffiliation] || '';
      }
    }
  };
  </script>
  
  <style scoped>
  .user-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    text-align: center;
    background-size: cover;
  }
  
  img {
    height: 340px;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(13, 20, 26, 0.4),0 4px 6px -4px rgba(13, 24, 32, 0.4);
  }

  .no-depth {
    height: 70px;
    padding: 6px;
    box-shadow: none;
  }
  
  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    margin-top: 0px;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 10px 0;
    text-align: justify;
    letter-spacing: 3px;
    text-indent: 18px;
    margin-bottom: 1px;
    text-transform: capitalize;
  }
  
  p {
    font-size: 1.2rem;
    margin: 5px 0;
  }
  
  h4 {
    font-size: 1.5rem;
    margin-top: 20px;
  }
  
  ul {
    list-style-type: none;  /* This will create bullet points for each item */
    padding-left: 20px;
  }
  
  a {
    margin-top: 20px;
    padding: 10px;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0 5px;
    font-size: 16px;
    cursor: pointer;
    background-color: black;
    color: white;
    border-radius: 5px;
    outline: none;
  }
  
  a:hover {
    background-color: #3a3a3a;
  }

  .full {
    width: 80%;
    background-color: white;
    border-radius: 12px;
    background-color:rgba(255, 255, 255, 0.5);
  }


  .card {
    /* width: inherit; */
    width: 70%;
    /* padding: 1.5em 0.5em 0.5em; */
    text-align: center;
    border-radius: 1em;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    padding: 40px;
  }

  .card img {
    /* width: 150px;
    height: 150px;
    border-radius: 50%; */
    border: 3px solid white;
    float: inline-end;
  }

  .aff {
    text-align: justify;
    letter-spacing: 3px;
    text-indent: 18px;
    margin-bottom: 1px;
  }

  .just {
    letter-spacing: 1px;
    /* text-align: end; */
    text-align: justify;
    text-transform: capitalize;
  }

  .logos {
    display: flex;
  }

  .shipimage {
    box-shadow: none;
    z-index: 999;
    position: absolute;
    border: none !important;
    top: 460px;
    /* height: 400px;
    right: 380px; */
  }

  .shipimagex {
    box-shadow: none;
    z-index: 999;
    position: absolute;
    border: none !important;
    left: 400px;
    height: 400px;
  }

  .weaponimage {
    box-shadow: none;
    z-index: 999;
    position: absolute;
    border: none !important;
    left: 400px;
    height: 400px;
    top: 300px;
  }

  .shipimagefett {
    box-shadow: none;
    z-index: 999;
    position: absolute;
    border: none !important;
    left: 340px;
    height: 700px;
    top: 320px;
  }

  .shipimageluke {
    box-shadow: none;
    z-index: 999;
    position: absolute;
    border: none !important;
    height: 500px;
    top: 340px;
  }

  .shipimagedarth {
  box-shadow: none;
    z-index: 999;
    position: absolute;
    border: none !important;
    top: 420px;
    height: 420px;
    right: 360px;
  }

  .about {
    text-align: justify;
    width: 60%;
  }

  </style>
  