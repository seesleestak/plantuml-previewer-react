export default `title Example

Frontend -> Middletier: GET /posts

Middletier -> Backend: GET /comments
Backend -> Service: comments
Service --> Backend: return(comments)
Backend --> Middletier: return(comments)

alt links not provided
  Middletier -> Backend: GET /thumbnails
  Backend --> Middletier: return(thumbnails)
  Middletier -> Backend: GET /likes
  Backend --> Middletier: return(likes)
else  links provided
  Middletier -> Backend: POST /links
  Backend --> Middletier: return(links)
end

Middletier --> Frontend: return(posts)`;
