package main

import (
	"log"
	"net"
	"os"

	"github.com/spf13/cobra"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"github.com/togatoga/codeforces-problems/server/db"
)

var (
	production bool
)

type config struct {
	Host     string
	Port     string
	Username string
	Password string
	Database string
}

func InternalIPFilter() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			requestIP := net.ParseIP(c.RealIP())
			//only allow private ip
			for _, cidr := range []string{
				"127.0.0.0/8",    // IPv4 loopback
				"10.0.0.0/8",     // RFC1918
				"172.16.0.0/12",  // RFC1918
				"192.168.0.0/16", // RFC1918
				"::1/128",        // IPv6 loopback
				"fe80::/10",      // IPv6 link-local
				"fc00::/7",       // IPv6 unique local addr
			} {
				_, block, err := net.ParseCIDR(cidr)
				if err != nil {
					c.Echo().Logger.Error(err)
					return echo.ErrInternalServerError
				}
				if block.Contains(requestIP) {
					return next(c)
				}
			}
			//Allow prod ip
			ips, err := net.LookupIP("togatoga.net")
			if err != nil {
				c.Echo().Logger.Error(err)
				return echo.ErrInternalServerError
			}
			for _, ip := range ips {
				if ip.To4().String() == requestIP.String() {
					return next(c)
				}
			}

			return echo.ErrUnauthorized
		}
	}
}

func run() {
	e := echo.New()
	//work around
	e.Debug = true
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	var env string
	if production {
		env = "production"
	} else {
		env = "development"
	}
	serverConfig := viper.GetStringMap(env)["server"].(map[string]interface{})
	dbConfig := viper.GetStringMap(env)["db"].(map[string]interface{})
	username := dbConfig["username"].(string)
	password := dbConfig["password"].(string)
	database := dbConfig["database"].(string)
	baseURL := serverConfig["host"].(string)
	port := serverConfig["port"].(string)
	if !production {
		baseURL += ":" + port
	}
	db := db.NewDB(username, password, database, baseURL, port)
	defer db.Db.Close()

	//from db
	e.GET("api/v1/problems", db.Problems)
	e.GET("api/v1/contests", db.Contests)
	e.GET("api/v1/submissions", db.Submissions)

	//update data
	e.PUT("api/v1/problems", db.UpdateProblems, InternalIPFilter())
	e.PUT("api/v1/submissions/:user", db.UpdateSubmissions, InternalIPFilter())
	e.PUT("api/v1/contests", db.UpdateContests, InternalIPFilter())

	e.Logger.Fatal(e.Start(":" + port))
}

func initConfig() {
	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath("../setting")
	err := viper.ReadInConfig()
	if err != nil {
		log.Println(err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)
}

func main() {
	rootCmd := &cobra.Command{
		Use: "server",
		Run: func(c *cobra.Command, args []string) {
			run()
		},
	}
	rootCmd.PersistentFlags().BoolVarP(&production, "prod", "", false, "Run server in production environment")
	if err := rootCmd.Execute(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
