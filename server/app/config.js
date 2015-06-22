var Bookshelf = require('bookshelf');
var path = require('path');
var knex = require('knex');

var db = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'codeus',
    password: 'kbscjm', // initials of our names
    database: 'codeusdb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/codeus.mysql')
  }
});

db.knex.schema.hasTable('coders').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('coders', function (coder) {
      coder.increments('id').primary();
      coder.string('gh_username', 255);
      coder.string('name', 255);
      coder.string('photo_url', 255);
      coder.string('location', 255);
      coder.dateTime('gh_member_since');
      coder.integer('stars');
      coder.integer('forks');
      coder.integer('watchers');
      coder.integer('downloads');
      coder.integer('cred');
      coder.string('gh_site_url', 255);
      // tier 2 attributes below
      coder.integer('collab_count');
      coder.string('commit_pattern', 255);
      coder.integer('collab_per_repo');
      coder.integer('contrib_count');
      coder.string('commit_day_pattern', 255);
      coder.string('commit_hour_pattern', 255);
      coder.boolean('hireable');
      coder.string('organizations', 255);
      coder.string('so_location', 255);
      coder.string('so_name', 255);
      coder.dateTime('so_member_since');
      coder.integer('so_reputation');
      coder.integer('so_answer_count');
      coder.integer('so_question_count');
      coder.integer('so_upvote_count');
      coder.string('so_site_url', 255);
      // creates created & modified timestamp columns
      coder.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.integer('coder_id');
      user.string('token');
      user.string('messages_url', 255);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('languages').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('languages', function (user) {
      user.increments('id').primary();
      user.string('name');
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('join_coders_languages').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('coders_languages', function (language) {
      language.increments('id').primary();
      language.integer('coder_id');
      language.integer('language_id');
      language.integer('bytes_across_repos');
      language.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('technologies').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('technologies', function (tech) {
      tech.increments('id').primary();
      tech.string('name', 255);
      tech.string('language', 255);
      tech.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('technology_files').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('technology_files', function (file) {
      file.increments('id').primary();
      file.string('filename', 255);
      file.integer('filenologies_id');
      file.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('join_coders_technologies').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('coders_technologies', function (language) {
      language.increments('id').primary();
      language.integer('coder_id');
      language.integer('technology_id');
      language.integer('bytes_across_repos');
      language.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;