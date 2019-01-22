<?php
define('WP_AUTO_UPDATE_CORE', false);// This setting is required to make sure that WordPress updates can be properly managed in WordPress Toolkit. Remove this line if this WordPress instance is not managed by WordPress Toolkit anymore.
define('WP_DEBUG', true);
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'bmc_db' );

/** MySQL database username */
define( 'DB_USER', 'bmc_user' );

/** MySQL database password */
define( 'DB_PASSWORD', 'Chicomar87' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'TSq[@~[u51!()LyDTwBV6le%;-~n3@o/O7GSp292ybK;)dB3P5&jM7AA25!86ilV');
define('SECURE_AUTH_KEY', 'ra/|JUo9NF3LtEom9S968E08UtRrh@N&m65@Uvau8x]d7by]j80(26|!*(LqhRQ9');
define('LOGGED_IN_KEY', 'VM0h4vP+2AGn;zRa3d|f61l)CIi3-4*7w4ZG0a0_@o|ge5qU8LZI9[080C~Ln9u6');
define('NONCE_KEY', ':imSm*8;3u4mpg3XzpD9:7Td[0+u]0%S67D4~!mP&Omt7t44G6O/6TY[0aP@e1:Z');
define('AUTH_SALT', 'R7OO;Bz1~0hslh:7c7UKaB+-eu5(/*h]3#:Y]6b6U@S2W#_EIQgw2AZZO34[RK|k');
define('SECURE_AUTH_SALT', 'q_Ij|Yy+QJ|f5_FU)CB4Y1b/0~F9*C7D2Bv9lqz*ZC5]#3dq3@Dba24]iIh9]&(8');
define('LOGGED_IN_SALT', 'T6E!ZFpf3l8N4I:ire]K6@heN)&wT)83ga[161]ZT5O(B:@Dxu!Z%aL&]S|PwMOP');
define('NONCE_SALT', '8)*!0ERiq2N6WeOzn[DsLSPq9G5!0PURg4E2G93!n_RS&@t-B3l4aBqV#N[xgvs8');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'VikPO7_';


define('WP_ALLOW_MULTISITE', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
