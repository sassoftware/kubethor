package config

import (
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
	"net/http"
)

var (
	// CORS configuration
	CORS = cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// WebSocket Upgrader configuration
	WebSocketUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			// Implement your CORS policy here
			return true // For example, allow connections from any origin
		},
	}
)
