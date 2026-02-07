package com.openerp.app.domain.model.chat

data class FileAttachment(
    val id: String,
    val fileName: String,
    val fileSize: Long,
    val mimeType: String,
    val fileUri: String,
    val thumbnailUri: String? = null,
    val uploadedAt: Long = System.currentTimeMillis()
)

fun FileAttachment.getFileTypeIcon(): String {
    return when {
        mimeType.startsWith("image/") -> "🖼️"
        mimeType.startsWith("video/") -> "🎥"
        mimeType.startsWith("audio/") -> "🎵"
        mimeType == "application/pdf" -> "📄"
        mimeType.contains("document") || mimeType.contains("word") -> "📝"
        mimeType.contains("spreadsheet") || mimeType.contains("excel") -> "📊"
        mimeType.contains("presentation") || mimeType.contains("powerpoint") -> "📽️"
        mimeType.contains("zip") || mimeType.contains("rar") -> "🗜️"
        else -> "📎"
    }
}

fun FileAttachment.getFileSizeFormatted(): String {
    return when {
        fileSize < 1024 -> "$fileSize B"
        fileSize < 1024 * 1024 -> "${fileSize / 1024} KB"
        fileSize < 1024 * 1024 * 1024 -> "${fileSize / (1024 * 1024)} MB"
        else -> "${fileSize / (1024 * 1024 * 1024)} GB"
    }
}
