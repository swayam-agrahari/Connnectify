import { BarChart3, Bookmark, Heart, ImageIcon, MessageSquare, MoreHorizontal, Share2, Video, X } from "lucide-react";

export const CreatePostModal = ({ setNewPost, setShowCreatePost, newPost, handleCreatePost }: any) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">Create Post</h3>
                <button onClick={() => setShowCreatePost(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        JD
                    </div>
                    <div>
                        <p className="font-medium text-neutral-800 dark:text-white">John Doe</p>
                        <select className="text-sm text-neutral-600 dark:text-neutral-400 bg-transparent border-none">
                            <option>Public</option>
                            <option>Communities Only</option>
                        </select>
                    </div>
                </div>

                <textarea
                    className="w-full min-h-32 p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:text-white"
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />

                <div className="grid grid-cols-3 gap-2">
                    <button className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium">Photo</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        <Video className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-medium">Video</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">Poll</span>
                    </button>
                </div>
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                <button className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all" onClick={handleCreatePost}>
                    Post
                </button>
            </div>
        </div>
    </div>
);

export const PostCard = ({ post }: any) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                        {post.authorImage}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-800 dark:text-white">{post.author}</span>
                            <span className="text-xs text-neutral-500">• {post.time}</span>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{post.community}</span>
                    </div>
                </div>
                <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
            </div>

            <p className="text-neutral-800 dark:text-neutral-200 mb-3">{post.content}</p>

            <div className="flex flex-wrap gap-2 mb-3">
                {post.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                        #{tag}
                    </span>
                ))}
            </div>

            {post.image && (
                <img src={post.image} alt="" className="w-full h-64 object-cover rounded-lg mb-3" />
            )}

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-green-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.shares}</span>
                    </button>
                </div>
                <button className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 transition-colors">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
);