package main

import (
	"log"
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

func run() {
	e := echo.New()
	//work around
	e.Debug = true
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	var env string
	if production {
		env = "prod"
	} else {
		env = "dev"
	}
	serverConfig := viper.GetStringMap("server")[env].(map[string]interface{})
	dbConfig := viper.GetStringMap("db")[env].(map[string]interface{})
	username := dbConfig["username"].(string)
	password := dbConfig["password"].(string)
	database := dbConfig["database"].(string)
	baseURL := serverConfig["host"].(string)
	port := serverConfig["port"].(string)
	db := db.NewDB(username, password, database, baseURL, port)
	defer db.Db.Close()

	//from db
	e.GET("api/v1/problems", db.Problems)
	e.GET("api/v1/contests", db.Contests)
	e.GET("api/v1/submissions", db.Submissions)

	//update data
	e.PUT("api/v1/problems", db.UpdateProblems)
	e.PUT("api/v1/submissions/:user", db.UpdateSubmissions)
	e.PUT("api/v1/contests", db.UpdateContests)

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
