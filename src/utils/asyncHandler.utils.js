export function asyncHandler(fn){
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// provide a default export too for compatibility with older imports
export default asyncHandler;
