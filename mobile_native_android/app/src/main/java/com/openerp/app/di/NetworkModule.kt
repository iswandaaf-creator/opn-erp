package com.openerp.app.di

import com.openerp.app.data.remote.ApiService
import com.openerp.app.data.remote.SocketManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(sessionManager: com.openerp.app.data.local.SessionManager): okhttp3.OkHttpClient {
        val logging = okhttp3.logging.HttpLoggingInterceptor()
        logging.setLevel(okhttp3.logging.HttpLoggingInterceptor.Level.BODY)
        
        return okhttp3.OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor { chain ->
                val token = kotlinx.coroutines.runBlocking { 
                    kotlinx.coroutines.flow.firstOrNull(sessionManager.getToken())
                }
                
                val original = chain.request()
                val requestBuilder = original.newBuilder()
                
                if (!token.isNullOrEmpty()) {
                    requestBuilder.header("Authorization", "Bearer $token")
                }
                
                chain.proceed(requestBuilder.build())
            }
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: okhttp3.OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://fat-freida-kukikuki-e5bb1b61.koyeb.app/") // Production Backend
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideSocketManager(): SocketManager {
        return SocketManager()
    }
}
