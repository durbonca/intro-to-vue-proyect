var eventBus = new Vue()

Vue.component('product-review', {
    template: `
    
    <form class="review-form" @submit.prevent="onSubmit">
    
    
    <p v-if="errors.length">
    <b>please correct the next error(s)</b>
    <ul>
        <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }

    },

    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }
        }
    }

})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },

    template: `
    <div>
        <span class="tab" :class="{ activeTab: selectedTab === tab}" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">{{ tab }}</span>
    <div>
    
    
    
    <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">there are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>{{ review.review }}</p>
                    <p>Ratting: {{ review.rating }}</p>
                    </li>
                </ul>

            </div>

            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
    
    `,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>
            <div class="product-info">
                <h1> {{ title }} </h1>
                <p v-if="!inStock">Out of Stock</p>
                <p v-else>In Stock</p>
                <p>Shipping: {{ shipping }}</p>
                <ul>
                    <li v-for="detail in details"> {{ detail }} </li>
                </ul>
                <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProducts(index)">

                </div>

                <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>
                
            </div>

                <product-tabs :reviews="reviews"></product-tabs>

            
    </div>
    `,
    data() {
        return {
            products: 'Socks',
            brand: 'Vue Mastery',
            description: 'goods for the weather',
            selectedVariants: 0,
            details: ["80% cotton", "20% polyester", "gender-neutral"],
            variants: [{
                variantId: 2234,
                variantColor: "green",
                variantQuantity: 10,
                variantImage: './assets/vmSocks-green-onWhite.jpg'
            }, {
                variantId: 2235,
                variantColor: "blue",
                variantQuantity: 5,
                variantImage: './assets/vmSocks-blue-onWhite.jpg'
            }],

            reviews: []

        }
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariants].variantId)
            this.variants[this.selectedVariants].variantQuantity -= 1
        },
        updateProducts(index) {
            this.selectedVariants = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.products
        },
        image() {
            return this.variants[this.selectedVariants].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariants].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

var app = new Vue({
    el: '#app',

    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})