using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Entities;
using API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers
{
    // localhost:5001/api/account
    public class AccountController(AppDbContext context) : BaseApiController
    {
        // POST: api/account/register
        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (!await IsEmailUnique(registerDto.Email.ToLower().Trim()))
            {
                return BadRequest("Email is already taken");
            }

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName.Trim(),
                Email = registerDto.Email.ToLower().Trim(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password.Trim())),
                PasswordSalt = hmac.Key
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower().Trim());
            if (user == null) return Unauthorized("Invalid email or password");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password.Trim()));
            for (var i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return Ok(user);
        }

        private async Task<bool> IsEmailUnique(string email)
        {
            return !await context.Users.AnyAsync(x => x.Email == email);
        }
    }
}