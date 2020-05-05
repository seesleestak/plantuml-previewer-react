export default `title Example

autoactivate on

Frontend -> Middletier: GET /posts

Middletier -> Backend: GET /comments
Backend -> Service: GET /comments
return comments
return comments

alt links not provided
    Middletier -> Backend: GET /thumbnails
    return thumbnails
    Middletier -> Backend: GET /likes
    return likes
else  links provided
    Middletier -> Backend: POST /links
    return links
end

return posts`;
