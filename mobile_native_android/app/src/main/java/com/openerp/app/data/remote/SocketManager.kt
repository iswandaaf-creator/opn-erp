package com.openerp.app.data.remote

import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import java.net.URI
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SocketManager @Inject constructor() {
    private var socket: Socket? = null
    // Use 10.0.2.2 for Android Emulator to access localhost
    private val SOCKET_URL = "http://10.0.2.2:3000" 

    fun connect(userId: String) {
        if (socket?.connected() == true) return

        val options = IO.Options.builder()
            .setQuery("userId=$userId")
            .setTransports(arrayOf("websocket"))
            .build()

        socket = IO.socket(URI.create(SOCKET_URL), options)
        socket?.connect()

        socket?.on(Socket.EVENT_CONNECT) {
            println("Socket connected: ${socket?.id()}")
        }
        
        socket?.on(Socket.EVENT_CONNECT_ERROR) { args ->
            println("Socket connection error: ${args[0]}")
        }
    }

    fun disconnect() {
        socket?.disconnect()
        socket = null
    }

    fun emit(event: String, vararg args: Any) {
        socket?.emit(event, *args)
    }

    fun on(event: String): Flow<Any> = callbackFlow {
        val listener = io.socket.emitter.Emitter.Listener { args ->
            if (args.isNotEmpty()) {
                trySend(args[0])
            }
        }
        socket?.on(event, listener)
        awaitClose {
            socket?.off(event, listener)
        }
    }
    
    fun isConnected(): Boolean = socket?.connected() == true
}
