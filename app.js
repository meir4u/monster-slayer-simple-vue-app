const PLAYER_NAME = 'player';
const MONSTER_NAME = 'monster';

const PLAYER_ATTACK_STR = 'attack-monster';
const MONSTER_ATTACK_STR = 'monster-attack';
const SPECIAL_ATTACK_STR = 'special-attack';
const HEAL = 'heal';

function getRandomValue(min, max) {
    return Math.abs(Math.floor(Math.random() * (max - min)));
}

/**
 * return new health value after subtracting attack value
 * @param {user health} health 
 * @param {attack value} attackValue 
 * @returns 
 */
function attack(health, attackValue) {
    if (health < attackValue) {
        health = 0;
    } else {

        health -= attackValue;
    }
    return health;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            round: 0,
            winner: '',
            log: [],
        };
    },
    watch: {
        /**
         * if monster health change other then new game setup then attack the player
         * if health go bellow zero setup who won.
         * @param {*} v 
         */
        monsterHealth(v) {
            if (v > 0 && v !== 100) {
                this.attacPlayer();
            }

            if (v <= 0) {
                this.monsterHealth = 0;
                this.whoWon();
            }
        },
        /**
         * if player health go bellow 0 set it to 0 
         * and
         * set who won if health is zero
         * @param {*} v 
         */
        playerHealth(v) {
            if (v <= 0) {
                this.playerHealth = 0;
                this.whoWon();
            }
        }
    },
    computed: { 
        monsterHealthBar() {
            return { width: this.monsterHealth + '%' }
        },
        playerHealthBar() {
            return { width: this.playerHealth + '%' }
        },
        isCanSpecialAttack() {
            return !(this.round >= 3);
        },
        getWinner() {
            return this.winner;
        },
        isGameEnd() {
            return this.winner !== '';
        }
    },
    methods: {
        /**
         * start a new game and reset all the values
         */
        newGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.round = 0;
            this.winner = '';
            this.log = [];
        },
        /**
         * check if we can continue to play
         * @returns bool
         */
        isCanPlay() {
            return this.playerHealth > 0 && this.monsterHealth > 0;
        },
        /**
         * the player attack monster
         */
        attacMonster() {
            if (this.isCanPlay()) {
                const attactValue = getRandomValue(12, 5);
                this.monsterHealth = attack(this.monsterHealth, attactValue);
                this.round++;
                this.addLogMessages(PLAYER_NAME, PLAYER_ATTACK_STR, attactValue);
            }
        },
        /**
         * the monster attack player
         */
        attacPlayer() {
            if (this.isCanPlay()) {
                const attactValue = getRandomValue(15, 8)
                this.playerHealth = attack(this.playerHealth, attactValue);
                this.addLogMessages(PLAYER_NAME, MONSTER_ATTACK_STR, attactValue);
            }
        },
        /**
         * allow special attack - the damage will be stronger
         */
        specialAttackMonster() {
            if (this.isCanPlay()) {
                const attactValue = getRandomValue(25, 10);
                this.monsterHealth = attack(this.monsterHealth, attactValue);
                this.round = 0;
                this.addLogMessages(PLAYER_NAME, SPECIAL_ATTACK_STR, attactValue);
            }
        },
        /**
         * add health to the player
         */
        heal() {
            const healValue = getRandomValue(20, 8);
            if (this.isCanPlay()) {
                let newHealthValue = this.playerHealth + healValue;

                if (newHealthValue > 100) {
                    this.playerHealth = 100;
                } else {
                    this.playerHealth += healValue;
                }
                this.round++;
                this.attacPlayer();
                this.addLogMessages(PLAYER_NAME, HEAL, healValue);
            }
        },
        /**
         * test who won the game
         */
        whoWon() {
            if (this.monsterHealth === this.playerHealth) {
                this.winner = 'This is a draw!';
            } else if (this.monsterHealth >= this.playerHealth) {
                this.winner = MONSTER_NAME + ' Won!';
            } else {
                this.winner = PLAYER_NAME + ' Won!';
            }
            this.addLogMessages('Game End', 'game sammary', this.winner);
        },
        /**
         * if player surrender set his health to zero.
         */
        surrender() {
            this.playerHealth = 0;
        },
        addLogMessages(who, what, value) {
            this.log.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            });
        }

    },
});

app.mount('#game');